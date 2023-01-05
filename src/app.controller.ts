import { AppService } from './app.service';
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiROfResponse } from '@common/ApiROfResponse';
import { ApiExtraModels, ApiOperation } from '@nestjs/swagger';
import axios from 'axios';
import { RDto } from '@common/Result.dto';
import { Column } from 'typeorm';
import { AppReadJsonRes, AppReadJsonWhereDto } from './app.dto';

@ApiExtraModels(AppReadJsonRes)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
    /**
     * 代码生成信息表详情
     */
    @ApiOperation({ summary: '获取json内容' })
    @ApiROfResponse(AppReadJsonRes)
    @Post('/json/details')
    async readJson(@Body() dto: AppReadJsonWhereDto) {
        const { data } = await axios.get(dto.url).catch(err => {
            throw new BadRequestException('json链接读取失败 ！！！');
        });
        if (!data || !data.paths) {
            throw new BadRequestException('json链接读取失败 ！！！');
        }
        return new RDto({ data: { json: data } });
    }
}
