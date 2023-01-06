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
@Injectable()
export class GenTableService {
    constructor(@InjectRepository(GenTableEntity) private genTableRepository: Repository<GenTableEntity>) {}

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
            relations: ['columns', 'relations'],
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
    async genCode(ids: number[]) {
        const entities = await this.genTableRepository.find({
            where: {
                id: In(ids),
            },
            relations: ['columns', 'relations'],
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
        entities.map((entity, idx) => {
            // writeFile(Date.now() + lowerFirst(entity.name).replace(/Entity$/, '.entity.ts'), strs[idx]);
            zip.file(lowerFirst(entity.name).replace(/Entity$/, '') + '.entity.ts', strs[idx]);
            // 前端代码
            const temp = new FeRuoYiElementTemp(entity);
            zip.file(upperFirst(entity.name).replace(/Entity$/, '') + '.vue', temp.genString());
        });
        return zip.generateAsync({
            // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
            type: 'array',
            // 压缩算法
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9,
            },
        });
    }
}
