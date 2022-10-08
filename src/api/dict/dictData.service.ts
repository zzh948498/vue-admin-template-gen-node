import { BadRequestException, Injectable } from '@nestjs/common';
import { DictDataCreateDto, DictDataListDto, DictDataAllDto, DictDataUpdateDto } from './dto';
import { DictDataEntity } from './entities/dictData.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class DictDataService {
    constructor(@InjectRepository(DictDataEntity) private dictDataRepository: Repository<DictDataEntity>) {}

    async create(entity: DictDataCreateDto) {
        return this.dictDataRepository.save(entity);
    }

    findAll(dto: DictDataAllDto) {
        return this.dictDataRepository.find({
            where: dto.where,
            order: { createdAt: 'DESC' },
        });
    }
    async list(dto: DictDataListDto) {
        const { page = 1, psize = 20 } = dto.limit || {};
        const [data, total] = await Promise.all([
            this.dictDataRepository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.dictDataRepository.count({
                where: dto.where,
            }),
        ]);
        return { data, total };
    }
    async findById(id: number) {
        const entity = await this.dictDataRepository.findOneBy({ id });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(id: number, update: DictDataUpdateDto) {
        return this.dictDataRepository.update(id, update);
    }
    async delete(id: number) {
        return this.dictDataRepository.delete({ id });
    }
    async deletes(ids: number | number[]) {
        return this.dictDataRepository.delete(ids);
    }
}
