import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class GenTableUpdateDto {
    /**
     * 表名称
     */
    @ApiProperty({
        description: '表名称',
        required: false,
    })
    @IsOptional()
    entityName?: string;
    /**
     * 表描述
     */
    @ApiProperty({
        description: '表描述',
        required: false,
    })
    @IsOptional()
    desc?: string;
    /**
     * 备注
     */
    @ApiProperty({
        description: '备注',
        required: false,
    })
    @IsOptional()
    remark?: string;
}
