import { BadRequestException, Injectable } from '@nestjs/common';
import { GenTableCreateDto, GenTableListDto, GenTableAllDto, GenTableUpdateDto } from './dto';
import { GenTableEntity } from './entities/genTable.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnOptions, In, Repository } from 'typeorm';
import * as JSZip from 'jszip';
import { lowerFirst, upperFirst } from 'lodash';
import { ColumnsType } from './entities/genColumns.entity';
import { writeFile } from 'fs-extra';
import { GenTableRelationsEntityTypeEnum } from './entities/genTableRelations.entity';
import { FeRuoYiElementTemp } from './feTemps/ruoyi.element';
import { FeElementPlusTemp } from './feTemps/element.plus';
import { FeGiimeTemp } from './feTemps/giime';
import { FeTempsFactory } from './feTemps/feTempsFactory';
import { Project } from 'ts-morph';

import { join } from 'path';
import { GenTableGenCodeDto } from './dto/genTable-genCode.dto';
import { FeAiMdTemp } from './feTemps/ai.md';
@Injectable()
export class GenTableService {
    constructor(@InjectRepository(GenTableEntity) private genTableRepository: Repository<GenTableEntity>) {}
    templates: { name: string; tempClass: typeof FeTempsFactory }[] = [
        { name: 'giime', tempClass: FeElementPlusTemp },
        { name: 'ai', tempClass: FeElementPlusTemp },
        { name: 'element-plus', tempClass: FeElementPlusTemp },
        { name: 'ruoyi', tempClass: FeRuoYiElementTemp },
    ];
    async create(entity: GenTableCreateDto) {
        return this.genTableRepository.save(entity);
    }

    findAll(dto: GenTableAllDto) {
        return this.genTableRepository.find({
            where: dto.where,
            order: { createdAt: 'DESC' },
            relations: ['columns', 'relations'],
        });
    }
    async list(dto: GenTableListDto) {
        const { page = 1, psize = 20 } = dto.limit || {};
        const [data, total] = await Promise.all([
            this.genTableRepository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.genTableRepository.count({
                where: dto.where,
            }),
        ]);
        return { data, total };
    }
    async findById(id: number) {
        const entity = await this.genTableRepository.findOne({
            where: { id },
            relations: {
                columns: true,
                relations: true,
            },
            // relationLoadStrategy: 'query',
            order: {
                columns: {
                    createdAt: 'DESC',
                },
            },
        });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(id: number, update: GenTableUpdateDto) {
        return this.genTableRepository.update(id, update);
    }
    async delete(id: number | number[]) {
        return this.genTableRepository.delete(id);
    }
    async genCode(dto: GenTableGenCodeDto) {
        const ids = dto.ids;
        const entities = await this.genTableRepository.find({
            where: {
                id: In(ids),
            },
            relations: {
                columns: true,
                relations: true,
            },
            // relationLoadStrategy: 'query',
            order: {
                columns: {
                    createdAt: 'DESC',
                },
            },
        });
        if (!entities.length) {
            throw new BadRequestException('未找到相关信息');
        }
        const strs = entities.map(entity => {
            // 创建枚举
            const enums = entity.columns
                .filter(it => it.isEnum)
                .map(it => {
                    return `
export enum ${upperFirst(entity.name)}${upperFirst(it.name)}Enum {${it.enumValues
                        ?.map(ele => {
                            return `
    ${ele}${it.tsType === ColumnsType.string ? ` = '${ele}'` : ''},`;
                        })
                        .join('')}
}
`;
                })
                .join('');
            //  关系字符串
            let relationsStr = '';
            const JoinColumnTypes = [
                GenTableRelationsEntityTypeEnum.OneToOne,
                GenTableRelationsEntityTypeEnum.ManyToOne,
            ];
            const typeormImports = new Set<string>();
            entity.relations.map(relation => {
                if (relation.type !== GenTableRelationsEntityTypeEnum.OneToMany) {
                    typeormImports.add('JoinColumn');
                }
                const fkName = `${relation.relationColumn}${upperFirst(relation.subTableFkName)}`;
                const isArrRelation =
                    relation.type === GenTableRelationsEntityTypeEnum.OneToMany ||
                    relation.type === GenTableRelationsEntityTypeEnum.ManyToMany;
                // 字符串拼接
                relationsStr += `
    /**
     * ${relation.relationColumn}
     */
    @${relation.type}(() => ${relation.subTableName}, ${relation.relationColumn} => ${
                    relation.relationColumn
                }.${relation.targetColumn})${
                    JoinColumnTypes.includes(relation.type)
                        ? `
    @JoinColumn({ name: '${fkName}' })`
                        : ''
                } 
    ${relation.relationColumn}: ${relation.subTableName}${isArrRelation ? '[]' : ''};
                    `;
                if (JoinColumnTypes.includes(relation.type)) {
                    relationsStr += `
    /**
     * ${fkName}
     */
    @Column({ name: '${fkName}' })
    ${fkName}: number; 
    `;
                }
                typeormImports.add(relation.type);
            });
            const typeormImportsStr = [...typeormImports]
                .map(
                    it => `
    ${it},`
                )
                .join('');
            return `import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,${typeormImportsStr}
} from 'typeorm';
${enums}
/**
 * ${entity.desc}
 */
@Entity()
export class ${upperFirst(entity.name)} extends BaseEntity {
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;
    ${entity.columns
        .map(column => {
            const columnOptions: ColumnOptions = {};
            if (!column.required) {
                columnOptions.nullable = true;
            }
            let tsType: string | ColumnsType = column.tsType;
            if (column.isEnum) {
                tsType = `${upperFirst(entity.name)}${upperFirst(column.name)}Enum`;
                columnOptions.type = `'enum'` as any;
                columnOptions.enum = tsType;
            }
            let columnOptionsStr = '';
            if (Object.keys(columnOptions).length !== 0) {
                columnOptionsStr = `{${Object.keys(columnOptions)
                    .map(key => {
                        return `
        ${key}: ${columnOptions[key]},`;
                    })
                    .join('')}
    }`;
            }
            return `
    /**
     * ${column.desc}
     */
    @Column(${columnOptionsStr})
    ${column.name}${column.required ? '' : '?'}: ${tsType};
    `;
        })
        .join('')}
    /**
     * 创建时间
     */
    @CreateDateColumn()
    createdAt: Date;
    /**
     * 修改时间
     */
    @UpdateDateColumn()
    updatedAt: Date;
${relationsStr}
}

`;
        });
        const zip = new JSZip();
        for (let idx = 0; idx < entities.length; idx++) {
            const entity = entities[idx];
            zip.file(lowerFirst(entity.name).replace(/Entity$/, '') + '.entity.ts', strs[idx]);
            // 前端代码
            const temp = new FeElementPlusTemp(entity);
            const feString = temp.genString();
            zip.file(upperFirst(entity.name).replace(/Entity$/, '') + '.vue', feString);
        }

        return {
            fileName: 'ruoyi.zip',
            type: 'application/zip',
            value: await zip.generateAsync({
                // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
                type: 'array',
                // 压缩算法
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9,
                },
            }),
        };
    }
    async genAiMd(dto: GenTableGenCodeDto) {
        const entities = await this.genTableRepository.find({
            where: {
                id: In(dto.ids),
            },
            relations: {
                columns: true,
                relations: true,
            },
            // relationLoadStrategy: 'query',
            order: {
                columns: {
                    createdAt: 'DESC',
                },
            },
        });
        if (!entities.length) {
            throw new BadRequestException('未找到相关信息');
        }
        const firstFileList = new FeAiMdTemp(entities[0], dto).genZipOption();
        if (entities.length === 1 && firstFileList.length === 1) {
            return {
                fileName: 'ai.md',
                type: 'text/markdown',
                value: Array.from(Buffer.from(firstFileList[0].value)),
            };
        }
        const zip = new JSZip();
        for (let idx = 0; idx < entities.length; idx++) {
            const entity = entities[idx];
            const fileList = new FeAiMdTemp(entity, dto).genZipOption();
            for (const item of fileList) {
                zip.file(`${lowerFirst(entity.name)}/${item.fileName}`, item.value);
            }
        }

        return {
            fileName: 'ai.zip',
            type: 'application/zip',
            value: await zip.generateAsync({
                // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
                type: 'array',
                // 压缩算法
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9,
                },
            }),
        };
    }
    async genGiime(dto: GenTableGenCodeDto) {
        const entities = await this.genTableRepository.find({
            where: {
                id: In(dto.ids),
            },
            relations: {
                columns: true,
                relations: true,
            },
            // relationLoadStrategy: 'query',
            order: {
                columns: {
                    createdAt: 'DESC',
                },
            },
        });
        if (!entities.length) {
            throw new BadRequestException('未找到相关信息');
        }
        const zip = new JSZip();
        for (let idx = 0; idx < entities.length; idx++) {
            const entity = entities[idx];
            const fileList = new FeGiimeTemp(entity, dto).genZipOption();
            for (const item of fileList) {
                zip.file(`${lowerFirst(entity.name)}/${item.fileName}`, item.value);
            }
        }

        return {
            fileName: 'giime.zip',
            type: 'application/zip',
            value: await zip.generateAsync({
                // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
                type: 'array',
                // 压缩算法
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9,
                },
            }),
        };
    }
    async importInterface(interfaceText: string) {
        const project = new Project();
        const sourceFile = project.createSourceFile('test.ts', interfaceText);
        const interfaces = sourceFile.getInterfaces();
        if (interfaces.length !== 1) {
            throw new BadRequestException('interface有且只有一个');
        }
        const [interfaceDeclaration] = interfaces;
        const properties = interfaceDeclaration.getProperties();
        return properties.map(it => {
            const name = it.getName();
            const [jsDocs] = it.getJsDocs();
            const jsDocsName = jsDocs?.getComment() ?? '';
            const type1 = it.getType();
            const typeName = type1.getText();
            const hasQuestionToken = it.hasQuestionToken();
            return {
                name,
                desc: jsDocsName,
                tsType: Object.values(ColumnsType).includes(typeName as any) ? typeName : 'string',
                hasQuestionToken: hasQuestionToken,
            };
        });
    }
}
