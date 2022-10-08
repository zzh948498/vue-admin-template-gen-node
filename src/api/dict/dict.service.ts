import { BadRequestException, Injectable } from '@nestjs/common';
import { DictCreateDto, DictListDto, DictAllDto, DictUpdateDto } from './dto';
import { DictEntity } from './entities/dict.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        const [data, total] = await Promise.all([
            this.dictRepository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.dictRepository.count({
                where: dto.where,
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
