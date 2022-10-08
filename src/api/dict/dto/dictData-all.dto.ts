import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DictDataEntityStatusEnum } from '../entities/dictData.entity';
class DictDataAllWhereDto {
    /**
     * 字典标签
     */
    @IsOptional()
    label?: string;
    /**
     * 字典排序
     */
    @IsOptional()
    sort?: number;
    /**
     * 是否默认
     */
    @IsOptional()
    isDefault?: boolean;
    /**
     * 字典键值
     */
    @IsOptional()
    value?: string;
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
    @IsOptional()
    dictId?: number;
}

export class DictDataAllDto {
    @ValidateNested()
    @IsOptional()
    // 这里不加Type不会验证
    @Type(() => DictDataAllWhereDto)
    where?: DictDataAllWhereDto;
}
