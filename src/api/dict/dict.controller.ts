import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { DictCreateDto, DictListDto, DictAllDto, DictUpdateDto } from './dto';
import { DictService } from './dict.service';
import { DictEntity } from './entities/dict.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { BodyIdsDto } from '@common/BodyIds.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';

@ApiTags('dict')
@ApiBearerAuth()
@ApiExtraModels(DictEntity)
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class DictController {
    constructor(private readonly dictService: DictService) {}
    /**
     * 新增字典表
     */
    @ApiOperation({ summary: '新增字典表' })
    @ApiROfResponse(DictEntity)
    @Post('/dict/create')
    async create(@Body() createDictDto: DictCreateDto) {
        const data = await this.dictService.create(createDictDto);
        return new RDto({ data });
    }
    /**
     * 字典表列表（query）
     */
    @ApiOperation({ summary: '字典表列表（query）' })
    @ApiROfResponse(DictEntity, 'array')
    @Post('/dict/list')
    async queryList(@Body() dto: DictListDto) {
        const { data, total } = await this.dictService.list(dto);
        return new RListDto({ data, total });
    }
    /**
     * 字典表列表
     */
    @ApiOperation({ summary: '字典表列表' })
    @ApiROfResponse(DictEntity, 'array')
    @Get('/dict/list')
    async list(@Query() limit: Limit) {
        const { data, total } = await this.dictService.list({ limit });
        return new RListDto({ data, total });
    }
    /**
     * 字典表列表-全部
     */
    @ApiOperation({ summary: '字典表列表-全部' })
    @ApiROfResponse(DictEntity, 'array')
    @Get('/dict/all')
    async findAll(@Query() dto: DictAllDto) {
        const data = await this.dictService.findAll(dto);
        return new RListDto({ data, total: data.length });
    }
    /**
     * 字典表详情
     */
    @ApiOperation({ summary: '某个字典表信息' })
    @ApiROfResponse(DictEntity)
    @Get('/dict/details/:id')
    async details(@Param('id') id: number) {
        const data = await this.dictService.findById(id);
        return new RDto({ data });
    }
    /**
     * 修改字典表
     */
    @ApiOperation({ summary: '修改字典表信息' })
    @ApiRPrimitiveOfResponse()
    @Patch('/dict/update/:id')
    async update(@Param('id') id: number, @Body() updateDictDto: DictUpdateDto) {
        await this.dictService.update(id, updateDictDto);
        return new RDto();
    }
    /**
     * 删除字典表
     */
    @ApiOperation({ summary: '删除字典表' })
    @ApiRPrimitiveOfResponse()
    @Delete('/dict/remove/:id')
    async remove(@Param('id') id: number) {
        await this.dictService.delete(id);
        return new RDto();
    }
    /**
     * 删除多个字典表
     */
    @ApiOperation({ summary: '删除多个字典表' })
    @ApiRPrimitiveOfResponse()
    @Post('/dict/removes')
    async removes(@Body() dto: BodyIdsDto) {
        await this.dictService.deletes(dto.ids);
        return new RDto();
    }
}
