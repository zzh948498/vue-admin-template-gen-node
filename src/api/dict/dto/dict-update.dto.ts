import { IsOptional } from 'class-validator';
import { DictEntityStatusEnum } from '../entities/dict.entity';
export class DictUpdateDto {
    /**
     * 字典名称
     */
    @IsOptional()
    title?: string;
    /**
     * 状态
     */
    @IsOptional()
    status?: DictEntityStatusEnum;
    /**
     * 备注
     */
    @IsOptional()
    remark?: string;
    /**
     * 字典类型
     */
    @IsOptional()
    type?: string;
}
