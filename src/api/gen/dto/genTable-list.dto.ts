import { Limit } from '@common/utils/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
class GenTableListWhereDto {
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

export class GenTableListDto {
    @ApiProperty()
    @ValidateNested()
    @IsOptional()
    // 这里不加Type不会验证
    @Type(() => GenTableListWhereDto)
    where?: GenTableListWhereDto;
    @IsOptional()
    @ValidateNested()
    @Type(() => Limit)
    limit?: Limit;
}
