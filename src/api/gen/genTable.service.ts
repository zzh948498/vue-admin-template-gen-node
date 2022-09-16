import { BadRequestException, Injectable } from '@nestjs/common';
import { GenTableCreateDto, GenTableListDto, GenTableUpdateDto } from './dto';
import { GenTableEntity } from './entities/genTable.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class GenTableService {
    constructor(@InjectRepository(GenTableEntity) private genTableRepository: Repository<GenTableEntity>) {}

    async create(entity: GenTableCreateDto) {
        return this.genTableRepository.save(entity);
    }

    findAll() {
        return `This action returns all genTable`;
    }
    async list(dto: GenTableListDto) {
        const { page = 0, psize = 20 } = dto.limit || {};
        const [data, total] = await Promise.all([
            this.genTableRepository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: page * psize,
                take: psize,
            }),
            this.genTableRepository.count({
                where: dto.where,
            }),
        ]);
        return { data, total };
    }
    async findById(id: number) {
        const entity = await this.genTableRepository.findOneBy({ id });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(id: number, update: GenTableUpdateDto) {
        return this.genTableRepository.update(id, update);
    }
    async delete(id: number) {
        return this.genTableRepository.delete({ id });
    }
}
