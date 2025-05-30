import { Controller, Get, Post, Patch, Body, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenTableCreateDto, GenTableListDto, GenTableAllDto, GenTableUpdateDto } from './dto';
import { GenTableService } from './genTable.service';
import { GenTableEntity } from './entities/genTable.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';
import { BodyIdsDto } from '@common/BodyIds.dto';
import { Limit } from '@common/utils/constants';
import { GenTableGenCodeDto, GenTableGenCodeResultDto } from './dto/genTable-genCode.dto';
import { GenTableImportInterfaceDto } from './dto/genTable-importInterface.dto';
import { GenTableImportInterfaceResultDto } from './dto/genTable-importInterface-result.dto';
@ApiTags('genTable')
@ApiBearerAuth()
@ApiExtraModels(GenTableEntity, GenTableImportInterfaceResultDto, GenTableGenCodeResultDto)
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
    @ApiROfResponse(GenTableGenCodeResultDto, 'object')
    @Post('/genCode')
    async genCode(@Body() dto: GenTableGenCodeDto) {
        const templateServer = [
            { template: 'giime', handle: (dto: GenTableGenCodeDto) => this.genTableService.genGiime(dto) },
            { template: 'ai', handle: (dto: GenTableGenCodeDto) => this.genTableService.genAiMd(dto) },
        ];
        const handler =
            templateServer.find(it => it.template === dto.template)?.handle ??
            ((dto: GenTableGenCodeDto) => this.genTableService.genCode(dto));
        const data = await handler(dto);
        return new RDto({ data: data });
    }
    /**
     * 导入interface
     */
    @ApiOperation({ summary: '导入interface' })
    @ApiROfResponse(GenTableImportInterfaceResultDto, 'array')
    @Post('/importInterface')
    async importInterface(@Body() dto: GenTableImportInterfaceDto) {
        const data = await this.genTableService.importInterface(dto.interface);
        return new RDto({ data: data });
    }
    /**
     * 模板列表
     */
    @ApiOperation({ summary: '模板列表' })
    @ApiRPrimitiveOfResponse('string', 'array')
    @Get('/genCode/templates')
    async genTemplates() {
        const data = this.genTableService.templates.map(it => it.name);
        return new RDto({ data: data });
    }
}
