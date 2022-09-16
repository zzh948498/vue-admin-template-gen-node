import { IsOptional } from 'class-validator';
export class GenTableUpdateDto {
    /**
     * 表名称
     */
    @IsOptional()
    entityName?: string;
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
}
