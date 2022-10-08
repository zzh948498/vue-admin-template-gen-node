import { IsNotEmpty, IsOptional } from 'class-validator';
import { DictDataEntityStatusEnum } from '../entities/dictData.entity';
export class DictDataCreateDto {
    /**
     * 字典标签
     */
    @IsNotEmpty({
        message: '字典标签不能为空',
    })
    label: string;

    /**
     * 字典排序
     */
    @IsNotEmpty({
        message: '字典排序不能为空',
    })
    sort: number;

    /**
     * 是否默认
     */
    @IsOptional()
    isDefault?: boolean;

    /**
     * 字典键值
     */
    @IsNotEmpty({
        message: '字典键值不能为空',
    })
    value: string;

    /**
     * 状态（0正常 1停用）
     */
    @IsOptional()
    status?: DictDataEntityStatusEnum;

    /**
     * 备注
     */
    @IsOptional()
    remark?: string;

    /**
     * dictId
     */
    @IsNotEmpty({
        message: 'dictId不能为空',
    })
    dictId: number;

}
