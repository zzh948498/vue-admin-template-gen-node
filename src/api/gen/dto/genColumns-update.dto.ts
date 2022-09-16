import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ColumnsType } from '../entities/genColumns.entity';
export class GenColumnsUpdateDto {
    /**
     * 字段名称
     */
    @ApiProperty({
        description: '字段名称',
        required: false,
    })
    @IsOptional()
    entityName?: string;
    /**
     * 字段描述
     */
    @ApiProperty({
        description: '字段描述',
        required: false,
    })
    @IsOptional()
    desc?: string;
    /**
     * ts类型
     */
    @ApiProperty({
        description: 'ts类型',
        required: false,
    })
    @IsOptional()
    tsType?: ColumnsType;
    /**
     * 插入
     */
    @ApiProperty({
        description: '插入',
        required: false,
    })
    @IsOptional()
    isInsert?: boolean;
    /**
     * 编辑
     */
    @ApiProperty({
        description: '编辑',
        required: false,
    })
    @IsOptional()
    isEdit?: boolean;
    /**
     * 列表
     */
    @ApiProperty({
        description: '列表',
        required: false,
    })
    @IsOptional()
    isList?: boolean;
    /**
     * 查询
     */
    @ApiProperty({
        description: '查询',
        required: false,
    })
    @IsOptional()
    isQuery?: boolean;
    /**
     * 必填
     */
    @ApiProperty({
        description: '必填',
        required: false,
    })
    @IsOptional()
    required?: boolean;
    /**
     * 表id
     */
    @ApiProperty({
        description: '表id',
        required: false,
    })
    @IsOptional()
    tableId?: number;
}
