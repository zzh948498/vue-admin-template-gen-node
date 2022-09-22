import { BadRequestException, Injectable } from '@nestjs/common';
import { GenColumnsCreateDto, GenColumnsListDto, GenColumnsAllDto, GenColumnsUpdateDto } from './dto';
import { GenColumnsEntity } from './entities/genColumns.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class GenColumnsService {
    constructor(@InjectRepository(GenColumnsEntity) private genColumnsRepository: Repository<GenColumnsEntity>) {}

    async create(entity: GenColumnsCreateDto) {
        return this.genColumnsRepository.save(entity);
    }

    findAll(dto: GenColumnsAllDto) {
        return this.genColumnsRepository.find({
            where: dto.where,
            order: { createdAt: 'DESC' },
        });
    }
    async list(dto: GenColumnsListDto) {
        const { page = 1, psize = 20 } = dto.limit || {};
        const [data, total] = await Promise.all([
            this.genColumnsRepository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.genColumnsRepository.count({
                where: dto.where,
            }),
        ]);
        return { data, total };
    }
    async findById(id: number) {
        const entity = await this.genColumnsRepository.findOneBy({ id });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(id: number, update: GenColumnsUpdateDto) {
        return this.genColumnsRepository.update(id, update);
    }
    async delete(id: number) {
        return this.genColumnsRepository.delete({ id });
    }
}
