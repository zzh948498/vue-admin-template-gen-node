import { Limit } from '@common/utils/constants';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DictEntityStatusEnum } from '../entities/dict.entity';
class DictListWhereDto {
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

export class DictListDto {
    @ValidateNested()
    @IsOptional()
    // 这里不加Type不会验证
    @Type(() => DictListWhereDto)
    where?: DictListWhereDto;
    @IsOptional()
    @ValidateNested()
    @Type(() => Limit)
    limit?: Limit;
}
