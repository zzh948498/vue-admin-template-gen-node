import { BadRequestException, Injectable } from '@nestjs/common';
import { GenTableRelationsCreateDto, GenTableRelationsListDto, GenTableRelationsAllDto, GenTableRelationsUpdateDto } from './dto';
import { GenTableRelationsEntity } from './entities/genTableRelations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class GenTableRelationsService {
    constructor(@InjectRepository(GenTableRelationsEntity) private genTableRelationsRepository: Repository<GenTableRelationsEntity>) {}

    async create(entity: GenTableRelationsCreateDto) {
        return this.genTableRelationsRepository.save(entity);
    }

    findAll(dto: GenTableRelationsAllDto) {
        return this.genTableRelationsRepository.find({
            where: dto.where,
            order: { createdAt: 'DESC' },
        });
    }
    async list(dto: GenTableRelationsListDto) {
        const { page = 1, psize = 20 } = dto.limit || {};
        const [data, total] = await Promise.all([
            this.genTableRelationsRepository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.genTableRelationsRepository.count({
                where: dto.where,
            }),
        ]);
        return { data, total };
    }
    async findById(id: number) {
        const entity = await this.genTableRelationsRepository.findOneBy({ id });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(id: number, update: GenTableRelationsUpdateDto) {
        return this.genTableRelationsRepository.update(id, update);
    }
    async delete(id: number) {
        return this.genTableRelationsRepository.delete({ id });
    }
    async deletes(ids: number | number[]) {
        return this.genTableRelationsRepository.delete(ids);
    }
}
