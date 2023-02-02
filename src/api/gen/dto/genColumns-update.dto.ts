import { IsOptional } from 'class-validator';
import { ColumnsType, ColumnsHTMLType } from '../entities/genColumns.entity';
export class GenColumnsUpdateDto {
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
     * 是否枚举类型
     */
    @IsOptional()
    isEnum?: boolean;
    /**
     * 枚举类型的值
     */
    @IsOptional()
    enumValues?: string[];
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
     * html类型
     */
    @IsOptional()
    htmlType?: ColumnsHTMLType;
    /**
     * 表id
     */
    @IsOptional()
    tableId?: number;
}
