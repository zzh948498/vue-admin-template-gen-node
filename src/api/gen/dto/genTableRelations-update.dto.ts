import { IsOptional } from 'class-validator';
import { GenTableRelationsEntityTypeEnum } from '../entities/genTableRelations.entity';
export class GenTableRelationsUpdateDto {
    /**
     * 子表名称
     */
    @IsOptional()
    subTableName?: string;
    /**
     * 子表关系类型
     */
    @IsOptional()
    type?: GenTableRelationsEntityTypeEnum;
    /**
     * 子表关联的外键名
     */
    @IsOptional()
    subTableFkName?: string;
    /**
     * 自身关系字段
     */
    @IsOptional()
    relationColumn?: string;
    /**
     * 目标关系字段
     */
    @IsOptional()
    targetColumn?: string;
    /**
     * 表id
     */
    @IsOptional()
    tableId?: number;
}
