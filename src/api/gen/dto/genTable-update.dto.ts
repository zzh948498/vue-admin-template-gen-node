import { IsOptional } from 'class-validator';
import { TemplateCategory, TableRelations } from '../entities/genTable.entity';
export class GenTableUpdateDto {
    /**
     * 表名称
     */
    @IsOptional()
    name?: string;
    /**
     * 表描述
     */
    @IsOptional()
    desc?: string;
    /**
     * 备注
     */
    @IsOptional()
    remark?: string;
    /**
     * 生成模板类型
     */
    @IsOptional()
    tplCategory?: TemplateCategory;
    /**
     * 子表名称
     */
    @IsOptional()
    subTableName?: string;
    /**
     * 子表关系类型
     */
    @IsOptional()
    relations?: TableRelations;
    /**
     * 子表关联的外键名
     */
    @IsOptional()
    subTableFkName?: string;
}
