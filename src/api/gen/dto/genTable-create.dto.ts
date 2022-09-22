import { IsNotEmpty, IsOptional } from 'class-validator';
import { TemplateCategory, TableRelations } from '../entities/genTable.entity';
export class GenTableCreateDto {
    /**
     * 表名称
     */
    @IsNotEmpty({
        message: '表名称不能为空',
    })
    name: string;

    /**
     * 表描述
     */
    @IsNotEmpty({
        message: '表描述不能为空',
    })
    desc: string;

    /**
     * 备注
     */
    @IsOptional()
    remark?: string;

    /**
     * 生成模板类型
     */
    @IsNotEmpty({
        message: '生成模板类型不能为空',
    })
    tplCategory: TemplateCategory;

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
