import { IsNotEmpty, IsOptional } from 'class-validator';
import { DictEntityStatusEnum } from '../entities/dict.entity';
export class DictCreateDto {
    /**
     * 字典名称
     */
    @IsNotEmpty({
        message: '字典名称不能为空',
    })
    title: string;

    /**
     * 状态
     */
    @IsNotEmpty({
        message: '状态不能为空',
    })
    status: DictEntityStatusEnum;

    /**
     * 备注
     */
    @IsOptional()
    remark?: string;

    /**
     * 字典类型
     */
    @IsNotEmpty({
        message: '字典类型不能为空',
    })
    type: string;
}
