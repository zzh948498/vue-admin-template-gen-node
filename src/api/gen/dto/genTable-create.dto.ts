import { IsNotEmpty, IsOptional } from 'class-validator';
export class GenTableCreateDto {
    /**
     * 表名称
     */
    @IsNotEmpty({
        message: '表名称不能为空',
    })
    entityName: string;

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
    @IsNotEmpty({
        message: '备注不能为空',
    })
    remark: string;

}
