import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { GenTableRelationsCreateDto, GenTableRelationsListDto, GenTableRelationsAllDto, GenTableRelationsUpdateDto } from './dto';
import { GenTableRelationsService } from './GenTableRelations.service';
import { GenTableRelationsEntity } from './entities/GenTableRelations.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { BodyIdsDto } from '@common/BodyIds.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';

@ApiTags('genTableRelations')
@ApiBearerAuth()
@ApiExtraModels(GenTableRelationsEntity)
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class GenTableRelationsController {
    constructor(private readonly genTableRelationsService: GenTableRelationsService) {}
    /**
     * 新增代码生成关系表
     */
    @ApiOperation({ summary: '新增代码生成关系表' })
    @ApiROfResponse(GenTableRelationsEntity)
    @Post('/genTableRelations/create')
    async create(@Body() createGenTableRelationsDto: GenTableRelationsCreateDto) {
        const data = await this.genTableRelationsService.create(createGenTableRelationsDto);
        return new RDto({ data });
    }
    /**
     * 代码生成关系表列表（query）
     */
    @ApiOperation({ summary: '代码生成关系表列表（query）' })
    @ApiROfResponse(GenTableRelationsEntity, 'array')
    @Post('/genTableRelations/list')
    async queryList(@Body() dto: GenTableRelationsListDto) {
        const { data, total } = await this.genTableRelationsService.list(dto);
        return new RListDto({ data, total });
    }
    /**
     * 代码生成关系表列表
     */
    @ApiOperation({ summary: '代码生成关系表列表' })
    @ApiROfResponse(GenTableRelationsEntity, 'array')
    @Get('/genTableRelations/list')
    async list(@Query() limit: Limit) {
        const { data, total } = await this.genTableRelationsService.list({ limit });
        return new RListDto({ data, total });
    }
    /**
     * 代码生成关系表列表-全部
     */
    @ApiOperation({ summary: '代码生成关系表列表-全部' })
    @ApiROfResponse(GenTableRelationsEntity, 'array')
    @Get('/genTableRelations/all')
    async findAll(@Query() dto: GenTableRelationsAllDto) {
        const data = await this.genTableRelationsService.findAll(dto);
        return new RListDto({ data, total: data.length });
    }
    /**
     * 代码生成关系表详情
     */
    @ApiOperation({ summary: '某个代码生成关系表信息' })
    @ApiROfResponse(GenTableRelationsEntity)
    @Get('/genTableRelations/details/:id')
    async details(@Param('id') id: number) {
        const data = await this.genTableRelationsService.findById(id);
        return new RDto({ data });
    }
    /**
     * 修改代码生成关系表
     */
    @ApiOperation({ summary: '修改代码生成关系表信息' })
    @ApiRPrimitiveOfResponse()
    @Patch('/genTableRelations/update/:id')
    async update(@Param('id') id: number, @Body() updateGenTableRelationsDto: GenTableRelationsUpdateDto) {
        await this.genTableRelationsService.update(id, updateGenTableRelationsDto);
        return new RDto();
    }
    /**
     * 删除代码生成关系表
     */
    @ApiOperation({ summary: '删除代码生成关系表' })
    @ApiRPrimitiveOfResponse()
    @Delete('/genTableRelations/remove/:id')
    async remove(@Param('id') id: number) {
        await this.genTableRelationsService.delete(id);
        return new RDto();
    }
    /**
     * 删除多个代码生成关系表
     */
    @ApiOperation({ summary: '删除多个代码生成关系表' })
    @ApiRPrimitiveOfResponse()
    @Post('/genTableRelations/removes')
    async removes(@Body() dto: BodyIdsDto) {
        await this.genTableRelationsService.deletes(dto.ids);
        return new RDto();
    }
}
