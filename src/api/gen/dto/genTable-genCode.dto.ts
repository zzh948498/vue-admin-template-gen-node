import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

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
}
