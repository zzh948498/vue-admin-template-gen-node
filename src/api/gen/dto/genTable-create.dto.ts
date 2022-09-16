import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GenTableCreateDto {
    /**
     * 表名称
     */
    @ApiProperty({
        description: '表名称',
        required: true,
    })
    @IsNotEmpty({
        message: '表名称不能为空',
    })
    entityName: string;

    /**
     * 表描述
     */
    @ApiProperty({
        description: '表描述',
        required: true,
    })
    @IsNotEmpty({
        message: '表描述不能为空',
    })
    desc: string;

    /**
     * 备注
     */
    @ApiProperty({
        description: '备注',
        required: true,
    })
    @IsNotEmpty({
        message: '备注不能为空',
    })
    remark: string;

}
