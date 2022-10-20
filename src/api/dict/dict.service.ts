import { BadRequestException, Injectable } from '@nestjs/common';
import { DictCreateDto, DictListDto, DictAllDto, DictUpdateDto, DictListWhereDto } from './dto';
import { DictEntity } from './entities/dict.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Raw, Repository } from 'typeorm';
import { cloneDeep } from 'lodash';
@Injectable()
export class DictService {
    constructor(@InjectRepository(DictEntity) private dictRepository: Repository<DictEntity>) {}

    async create(entity: DictCreateDto) {
        return this.dictRepository.save(entity);
    }

    findAll(dto: DictAllDto) {
        return this.dictRepository.find({
            where: dto.where,
            order: { createdAt: 'DESC' },
        });
    }
    async list(dto: DictListDto) {
        const { page = 1, psize = 20 } = dto.limit || {};
        console.log(dto.where);
        const where = cloneDeep<Omit<DictListWhereDto, 'createdAt'>>(dto.where);
        Reflect.deleteProperty(where, 'createdAt');
        const findOptions: FindOptionsWhere<DictEntity> = {
            ...where,
        };
        if (dto.where.title) {
            findOptions.title = Like(`%${dto.where.title}%`);
        }
        if (dto.where.createdAt && dto.where.createdAt.length === 2) {
            findOptions.createdAt = Between(dto.where.createdAt[0], dto.where.createdAt[1]);
        }
        const [data, total] = await Promise.all([
            this.dictRepository.find({
                where: findOptions,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.dictRepository.count({
                where: findOptions,
            }),
        ]);
        return { data, total };
    }
    async findById(id: number) {
        const entity = await this.dictRepository.findOneBy({ id });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(id: number, update: DictUpdateDto) {
        return this.dictRepository.update(id, update);
    }
    async delete(id: number) {
        return this.dictRepository.delete({ id });
    }
    async deletes(ids: number | number[]) {
        return this.dictRepository.delete(ids);
    }
}
