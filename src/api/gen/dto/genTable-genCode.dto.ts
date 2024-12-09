import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class GenTableGenCodeDto {
    /**
     * ids
     */
    @ApiProperty()
    @IsArray()
    @IsNumber(undefined, { each: true })
    ids: number[];
    /**
     * 表单类型
     */
    @ApiProperty()
    @IsString()
    formType: string;
    /**
     * 模板
     */
    @ApiProperty()
    @IsString()
    template: string;
    /**
     * 接口地址
     */
    @ApiProperty()
    @IsString()
    apiController: string;
    /**
     * 是否有 产品需求文档
     */
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    hasPRD?: boolean;
}

export class GenTableGenCodeResultDto {
    /**
     * name
     */
    @ApiProperty()
    fileName: string;
    /**
     * type
     */
    @ApiProperty()
    type: string;
    /**
     * tsType
     */
    @ApiProperty()
    value: number[];
}
