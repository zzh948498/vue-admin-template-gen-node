import { BadRequestException, Injectable } from '@nestjs/common';
import { GenTableEntity } from './entities/genTable.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FeRuoYiElementTemp } from './feTemps/ruoyi.element';
import { FeElementPlusTemp } from './feTemps/element.plus';
import { FeTempsFactory } from './feTemps/feTempsFactory';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { GenAIGetTemplateQueryDto } from './dto/genAI-getTemplate.dto';
import { getAllFiles } from '@common/utils/getAllFiles';

@Injectable()
export class GenAIService {
    constructor(@InjectRepository(GenTableEntity) private genTableRepository: Repository<GenTableEntity>) {}
    templates: { name: string; tempClass: typeof FeTempsFactory }[] = [
        { name: 'giime', tempClass: FeElementPlusTemp },
        { name: 'element-plus', tempClass: FeElementPlusTemp },
        { name: 'ruoyi', tempClass: FeRuoYiElementTemp },
    ];
    /**
     * 获取ai编程 所需模板
     */
    async getTemplate(dto?: GenAIGetTemplateQueryDto) {
        const path = dto.path || 'reqs';
        const templatesDir = join(__dirname, './feTemps/ai/templates');
        const files = await getAllFiles(templatesDir);
        
        const result = await Promise.all(
            files.map(async (filePath) => {
                const relativePath = filePath.replace(templatesDir, '').replace(/\\/g, '/');
                const content = await readFile(filePath, 'utf-8');
                return {
                    fileName: `/templates${relativePath}`,
                    tempContent: content
                };
            })
        );

        return result;
    }
}
