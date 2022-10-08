import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { DictDataCreateDto, DictDataListDto, DictDataAllDto, DictDataUpdateDto } from './dto';
import { DictDataService } from './dictData.service';
import { DictDataEntity } from './entities/dictData.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { BodyIdsDto } from '@common/BodyIds.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';

@ApiTags('dictData')
@ApiBearerAuth()
@ApiExtraModels(DictDataEntity)
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class DictDataController {
    constructor(private readonly dictDataService: DictDataService) {}
    /**
     * 新增字典数据表
     */
    @ApiOperation({ summary: '新增字典数据表' })
    @ApiROfResponse(DictDataEntity)
    @Post('/dictData/create')
    async create(@Body() createDictDataDto: DictDataCreateDto) {
        const data = await this.dictDataService.create(createDictDataDto);
        return new RDto({ data });
    }
    /**
     * 字典数据表列表（query）
     */
    @ApiOperation({ summary: '字典数据表列表（query）' })
    @ApiROfResponse(DictDataEntity, 'array')
    @Post('/dictData/list')
    async queryList(@Body() dto: DictDataListDto) {
        const { data, total } = await this.dictDataService.list(dto);
        return new RListDto({ data, total });
    }
    /**
     * 字典数据表列表
     */
    @ApiOperation({ summary: '字典数据表列表' })
    @ApiROfResponse(DictDataEntity, 'array')
    @Get('/dictData/list')
    async list(@Query() limit: Limit) {
        const { data, total } = await this.dictDataService.list({ limit });
        return new RListDto({ data, total });
    }
    /**
     * 字典数据表列表-全部
     */
    @ApiOperation({ summary: '字典数据表列表-全部' })
    @ApiROfResponse(DictDataEntity, 'array')
    @Get('/dictData/all')
    async findAll(@Query() dto: DictDataAllDto) {
        const data = await this.dictDataService.findAll(dto);
        return new RListDto({ data, total: data.length });
    }
    /**
     * 字典数据表详情
     */
    @ApiOperation({ summary: '某个字典数据表信息' })
    @ApiROfResponse(DictDataEntity)
    @Get('/dictData/details/:id')
    async details(@Param('id') id: number) {
        const data = await this.dictDataService.findById(id);
        return new RDto({ data });
    }
    /**
     * 修改字典数据表
     */
    @ApiOperation({ summary: '修改字典数据表信息' })
    @ApiRPrimitiveOfResponse()
    @Patch('/dictData/update/:id')
    async update(@Param('id') id: number, @Body() updateDictDataDto: DictDataUpdateDto) {
        await this.dictDataService.update(id, updateDictDataDto);
        return new RDto();
    }
    /**
     * 删除字典数据表
     */
    @ApiOperation({ summary: '删除字典数据表' })
    @ApiRPrimitiveOfResponse()
    @Delete('/dictData/remove/:id')
    async remove(@Param('id') id: number) {
        await this.dictDataService.delete(id);
        return new RDto();
    }
    /**
     * 删除多个字典数据表
     */
    @ApiOperation({ summary: '删除多个字典数据表' })
    @ApiRPrimitiveOfResponse()
    @Post('/dictData/removes')
    async removes(@Body() dto: BodyIdsDto) {
        await this.dictDataService.deletes(dto.ids);
        return new RDto();
    }
}
