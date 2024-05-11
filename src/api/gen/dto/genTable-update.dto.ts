import { IsOptional } from 'class-validator';
import { TemplateCategory } from '../entities/genTable.entity';
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
     * 路由前缀
     */
    @IsOptional()
    pathPrefix?: string;
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
}
