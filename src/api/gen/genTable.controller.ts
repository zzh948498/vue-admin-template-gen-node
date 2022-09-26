import { Controller, Get, Post, Patch, Body, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenTableCreateDto, GenTableListDto, GenTableAllDto, GenTableUpdateDto } from './dto';
import { GenTableService } from './genTable.service';
import { GenTableEntity } from './entities/genTable.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';
import { BodyIdsDto } from '@common/BodyIds.dto';
import { Limit } from '@common/utils/constants';
import { Response } from 'express';
@ApiTags('genTable')
@ApiBearerAuth()
@ApiExtraModels(GenTableEntity)
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class GenTableController {
    constructor(private readonly genTableService: GenTableService) {}
    /**
     * 新增代码生成信息表
     */
    @ApiOperation({ summary: '新增代码生成信息表' })
    @ApiROfResponse(GenTableEntity)
    @Post('/genTable/create')
    async create(@Body() createGenTableDto: GenTableCreateDto) {
        const data = await this.genTableService.create(createGenTableDto);
        return new RDto({ data });
    }
    /**
     * 代码生成信息表列表（query）
     */
    @ApiOperation({ summary: '代码生成信息表列表（query）' })
    @ApiROfResponse(GenTableEntity, 'array')
    @Post('/genTable/list')
    async queryList(@Body() dto: GenTableListDto) {
        const { data, total } = await this.genTableService.list(dto);
        return new RListDto({ data, total });
    }
    /**
     * 代码生成信息表列表
     */
    @ApiOperation({ summary: '代码生成信息表列表' })
    @ApiROfResponse(GenTableEntity, 'array')
    @Get('/genTable/list')
    async list(@Query() limit: Limit) {
        const { data, total } = await this.genTableService.list({ limit });
        return new RListDto({ data, total });
    }
    /**
     * 代码生成信息表列表-全部
     */
    @ApiOperation({ summary: '代码生成信息表列表-全部' })
    @ApiROfResponse(GenTableEntity, 'array')
    @Get('/genTable/all')
    async findAll(@Query() dto: GenTableAllDto) {
        const data = await this.genTableService.findAll(dto);
        return new RListDto({ data, total: data.length });
    }
    /**
     * 代码生成信息表详情
     */
    @ApiOperation({ summary: '某个代码生成信息表信息' })
    @ApiROfResponse(GenTableEntity)
    @Get('/genTable/details/:id')
    async details(@Param('id') id: number) {
        const data = await this.genTableService.findById(id);
        return new RDto({ data });
    }
    /**
     * 修改代码生成信息表
     */
    @ApiOperation({ summary: '修改代码生成信息表信息' })
    @ApiRPrimitiveOfResponse()
    @Patch('/genTable/update/:id')
    async update(@Param('id') id: number, @Body() updateGenTableDto: GenTableUpdateDto) {
        await this.genTableService.update(id, updateGenTableDto);
        return new RDto();
    }
    /**
     * 删除代码生成信息表
     */
    @ApiOperation({ summary: '删除代码生成信息表' })
    @ApiRPrimitiveOfResponse()
    @Delete('/genTable/remove/:id')
    async remove(@Param('id') id: number) {
        await this.genTableService.delete(id);
        return new RDto();
    }
    /**
     * 删除代码生成信息表
     */
    @ApiOperation({ summary: '删除代码生成信息表' })
    @ApiRPrimitiveOfResponse()
    @Post('/genTable/removes')
    async removes(@Body() dto: BodyIdsDto) {
        await this.genTableService.delete(dto.ids);
        return new RDto();
    }

    /**
     * 生成代码
     */
    @ApiOperation({ summary: '生成代码' })
    @ApiRPrimitiveOfResponse('number', 'array')
    @Post('/genCode')
    async genCode(@Body() dto: BodyIdsDto) {
        const data = await this.genTableService.genCode(dto.ids);
        return new RDto({ data: data });
    }
}
