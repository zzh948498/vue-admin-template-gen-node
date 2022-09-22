import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, isNumber, IsOptional, Min } from 'class-validator';
import { join } from 'path';
import { IsNumberOrNumberString } from '../validator/isNumberOrNumberString';

export const PublicUrl = join(__dirname, '..', '..', '../public');
export class Limit {
    @ApiProperty({
        description: '页码',
        default: 1,
    })
    @IsOptional()
    @IsNumberOrNumberString({
        message: 'limit.page must be a number conforming to the specified constraints',
    })
    @Min(1)
    page?: number;
    @ApiProperty({
        description: 'psize',
        default: 20,
    })
    @IsOptional()
    @IsNumberOrNumberString({
        message: 'limit.psize must be a number conforming to the specified constraints',
    })
    psize?: number;
}
