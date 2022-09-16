import { IsOptional } from 'class-validator';
import { ColumnsType } from '../entities/genColumns.entity';
export class GenColumnsUpdateDto {
    /**
     * 字段名称
     */
    @IsOptional()
    entityName?: string;
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
