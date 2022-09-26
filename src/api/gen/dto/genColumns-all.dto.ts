import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ColumnsType } from '../entities/genColumns.entity';
class GenColumnsAllWhereDto {
    /**
     * 字段名称
     */
    @IsOptional()
    name?: string;
    /**
     * 字段描述
     */
    @IsOptional()
    desc?: string;
    /**
     * ts类型
     */
    @IsOptional()
    tsType?: ColumnsType;
    /**
     * 插入
     */
    @IsOptional()
    isInsert?: boolean;
    /**
     * 编辑
     */
    @IsOptional()
    isEdit?: boolean;
    /**
     * 列表
     */
    @IsOptional()
    isList?: boolean;
    /**
     * 查询
     */
    @IsOptional()
    isQuery?: boolean;
    /**
     * 必填
     */
    @IsOptional()
    required?: boolean;
    /**
     * 表id
     */
    @IsOptional()
    tableId?: number;
}

export class GenColumnsAllDto {
    @ValidateNested()
    @IsOptional()
    // 这里不加Type不会验证
    @Type(() => GenColumnsAllWhereDto)
    where?: GenColumnsAllWhereDto;
}