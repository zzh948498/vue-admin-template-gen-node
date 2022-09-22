import { Limit } from '@common/utils/constants';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TemplateCategory, TableRelations } from '../entities/genTable.entity';
class GenTableListWhereDto {
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

export class GenTableListDto {
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
