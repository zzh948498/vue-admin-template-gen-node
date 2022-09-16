import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { GenTableCreateDto, GenTableListDto, GenTableUpdateDto } from './dto';
import { GenTableService } from './genTable.service';

@ApiTags('genTable')
@ApiBearerAuth()
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
    @Post('/genTable/create')
    create(@Body() createGenTableDto: GenTableCreateDto) {
        return this.genTableService.create(createGenTableDto);
    }
    /**
     * 代码生成信息表列表（query）
     */
    @ApiOperation({ summary: '代码生成信息表列表（query）' })
    @Post('/genTable/list')
    queryList(@Body() dto: GenTableListDto) {
        return this.genTableService.list(dto);
    }
    /**
     * 代码生成信息表列表
     */
    @ApiOperation({ summary: '代码生成信息表列表' })
    @Get('/genTable/list')
    list(@Query() limit: Limit) {
        return this.genTableService.list({ limit });
    }
    // @Get('/genTable')
    // findAll() {
    //     return this.genTableService.findAll();
    // }
    /**
     * 代码生成信息表详情
     */
    @Get('/genTable/details/:id')
    @ApiOperation({ summary: '某个代码生成信息表信息' })
    @ApiResponse({
        status: 200,
        // description: 'The found record',
        // type: GetGenTableInfoResult,
    })
    details(@Param('id') id: number) {
        return this.genTableService.findById(id);
    }
    /**
     * 修改代码生成信息表
     */
    @Patch('/genTable/update/:id')
    @ApiOperation({ summary: '修改代码生成信息表信息' })
    update(@Param('id') id: number, @Body() updateGenTableDto: GenTableUpdateDto) {
        return this.genTableService.update(id, updateGenTableDto);
    }
    /**
     * 删除代码生成信息表
     */
    @ApiOperation({ summary: '删除代码生成信息表' })
    @Delete('/genTable/remove/:id')
    remove(@Param('id') id: number) {
        return this.genTableService.delete(id);
    }
}
