import { Controller, Post, Body,Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenAIService } from './genAI.service';
import { GenTableEntity } from './entities/genTable.entity';
import { RDto } from '@common/Result.dto';
import { ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';
import { GenTableGenCodeDto } from './dto/genTable-genCode.dto';
import { GenTableImportInterfaceResultDto } from './dto/genTable-importInterface-result.dto';
import { GenAIGetTemplateQueryDto } from './dto/genAI-getTemplate.dto';
@ApiTags('genTable')
@ApiBearerAuth()
@ApiExtraModels(GenTableEntity, GenTableImportInterfaceResultDto)
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class GenAIController {
    constructor(private readonly genAIService: GenAIService) {}
    /**
     * 生成ai编程所需的 模板代码
     */
    @ApiOperation({ summary: '生成ai编程所需的 模板代码' })
    @ApiRPrimitiveOfResponse('number', 'array')
    @Get('/genAI/getTemplate')
    async getTemplate(@Query() dto?: GenAIGetTemplateQueryDto) {
        const data = await this.genAIService.getTemplate(dto);
        return new RDto({ data: data });
    }
}
