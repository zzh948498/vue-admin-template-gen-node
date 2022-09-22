import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { GenColumnsCreateDto, GenColumnsListDto, GenColumnsAllDto, GenColumnsUpdateDto } from './dto';
import { GenColumnsService } from './genColumns.service';
import { GenColumnsEntity } from './entities/genColumns.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';

@ApiTags('genColumns')
@ApiBearerAuth()
@ApiExtraModels(GenColumnsEntity)
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class GenColumnsController {
    constructor(private readonly genColumnsService: GenColumnsService) {}
    /**
     * 新增代码生成字段表
     */
    @ApiOperation({ summary: '新增代码生成字段表' })
    @ApiROfResponse(GenColumnsEntity)
    @Post('/genColumns/create')
    async create(@Body() createGenColumnsDto: GenColumnsCreateDto) {
        const data = await this.genColumnsService.create(createGenColumnsDto);
        return new RDto({ data });
    }
    /**
     * 代码生成字段表列表（query）
     */
    @ApiOperation({ summary: '代码生成字段表列表（query）' })
    @ApiROfResponse(GenColumnsEntity, 'array')
    @Post('/genColumns/list')
    async queryList(@Body() dto: GenColumnsListDto) {
        const { data, total } = await this.genColumnsService.list(dto);
        return new RListDto({ data, total });
    }
    /**
     * 代码生成字段表列表
     */
    @ApiOperation({ summary: '代码生成字段表列表' })
    @ApiROfResponse(GenColumnsEntity, 'array')
    @Get('/genColumns/list')
    async list(@Query() limit: Limit) {
        const { data, total } = await this.genColumnsService.list({ limit });
        return new RListDto({ data, total });
    }
    /**
     * 代码生成字段表列表-全部
     */
    @ApiOperation({ summary: '代码生成字段表列表-全部' })
    @ApiROfResponse(GenColumnsEntity, 'array')
    @Get('/genColumns/all')
    async findAll(@Query() dto: GenColumnsAllDto) {
        const data = await this.genColumnsService.findAll(dto);
        return new RListDto({ data, total: data.length });
    }
    /**
     * 代码生成字段表详情
     */
    @ApiOperation({ summary: '某个代码生成字段表信息' })
    @ApiROfResponse(GenColumnsEntity)
    @Get('/genColumns/details/:id')
    async details(@Param('id') id: number) {
        const data = await this.genColumnsService.findById(id);
        return new RDto({ data });
    }
    /**
     * 修改代码生成字段表
     */
    @ApiOperation({ summary: '修改代码生成字段表信息' })
    @ApiRPrimitiveOfResponse()
    @Patch('/genColumns/update/:id')
    async update(@Param('id') id: number, @Body() updateGenColumnsDto: GenColumnsUpdateDto) {
        await this.genColumnsService.update(id, updateGenColumnsDto);
        return new RDto();
    }
    /**
     * 删除代码生成字段表
     */
    @ApiOperation({ summary: '删除代码生成字段表' })
    @ApiRPrimitiveOfResponse()
    @Delete('/genColumns/remove/:id')
    async remove(@Param('id') id: number) {
        await this.genColumnsService.delete(id);
        return new RDto();
    }
}
