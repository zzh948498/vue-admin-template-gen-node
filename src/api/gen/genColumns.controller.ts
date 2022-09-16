import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { GenColumnsCreateDto, GenColumnsListDto, GenColumnsUpdateDto } from './dto';
import { GenColumnsService } from './genColumns.service';
import { GenColumnsEntity } from './entities/genColumns.entity';
// import { PaginatedDto } from '@common/Result';
import { RDto, RListDto } from '@common/Result.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from './test';

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
    // @Get('/genColumns')
    // findAll() {
    //     return this.genColumnsService.findAll();
    // }
    /**
     * 代码生成字段表详情
     */
    @Get('/genColumns/details/:id')
    @ApiOperation({ summary: '某个代码生成字段表信息' })
    @ApiROfResponse(GenColumnsEntity)
    async details(@Param('id') id: number) {
        const data = await this.genColumnsService.findById(id);
        return new RDto({ data });
    }
    /**
     * 修改代码生成字段表
     */
    @Patch('/genColumns/update/:id')
    @ApiRPrimitiveOfResponse()
    @ApiOperation({ summary: '修改代码生成字段表信息' })
    async update(@Param('id') id: number, @Body() updateGenColumnsDto: GenColumnsUpdateDto) {
        await this.genColumnsService.update(id, updateGenColumnsDto);
        return new RDto();
    }
    /**
     * 删除代码生成字段表
     */
    @ApiOperation({ summary: '删除代码生成字段表' })
    @Delete('/genColumns/remove/:id')
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: getSchemaPath(GenColumnsEntity) } },
                code: {
                    type: 'integer',
                    description: '通用状态码[200:正常, 400: 客户端参数错误, 500: 服务器内部错误]',
                    format: 'int32',
                },
                msg: { type: 'string', description: '业务详细信息(可为空)' },
                status: {
                    type: 'integer',
                    description: '业务状态码(0为标准状态,其它见方法提示)',
                    format: 'int32',
                },
            },
        },
    })
    remove(@Param('id') id: number) {
        return this.genColumnsService.delete(id);
    }
}
