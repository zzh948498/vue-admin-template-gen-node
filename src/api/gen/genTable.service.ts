import { BadRequestException, Injectable } from '@nestjs/common';
import { GenTableCreateDto, GenTableListDto, GenTableAllDto, GenTableUpdateDto } from './dto';
import { GenTableEntity } from './entities/genTable.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as JSZip from 'jszip';
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
            relations: ['columns'],
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
        const entity = await this.genTableRepository.findOne({ where: { id }, relations: ['columns'] });

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
            relations: ['columns'],
        });
        if (!entities.length) {
            throw new BadRequestException('未找到相关信息');
        }
        const strs = entities.map(entity => {
            return `import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';

/**
 * ${entity.desc}
 */
@Entity()
export class ${entity.name} extends BaseEntity {
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;
    ${entity.columns.map(
        column => `
    /**
     * ${column.desc}
     */
    @Column()
    ${column.name}${column.required ? '' : '?'}: ${column.tsType};
    `
    )}
    /**
     * 表名称
     */
    @Column({ unique: true })
    name: string;
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
}

`;
        });
        const zip = new JSZip();
        entities.map((entity, idx) => {
            zip.file(entity.name.replace(/Entity$/, '.entity.ts'), strs[idx]);
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
