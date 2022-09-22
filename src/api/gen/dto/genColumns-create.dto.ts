import { IsNotEmpty, IsOptional } from 'class-validator';
import { ColumnsType } from '../entities/genColumns.entity';
export class GenColumnsCreateDto {
    /**
     * 字段名称
     */
    @IsNotEmpty({
        message: '字段名称不能为空',
    })
    name: string;

    /**
     * 字段描述
     */
    @IsNotEmpty({
        message: '字段描述不能为空',
    })
    desc: string;

    /**
     * ts类型
     */
    @IsNotEmpty({
        message: 'ts类型不能为空',
    })
    tsType: ColumnsType;

    /**
     * 插入
     */
    @IsNotEmpty({
        message: '插入不能为空',
    })
    isInsert: boolean;

    /**
     * 编辑
     */
    @IsNotEmpty({
        message: '编辑不能为空',
    })
    isEdit: boolean;

    /**
     * 列表
     */
    @IsNotEmpty({
        message: '列表不能为空',
    })
    isList: boolean;

    /**
     * 查询
     */
    @IsNotEmpty({
        message: '查询不能为空',
    })
    isQuery: boolean;

    /**
     * 必填
     */
    @IsNotEmpty({
        message: '必填不能为空',
    })
    required: boolean;

    /**
     * 表id
     */
    @IsNotEmpty({
        message: '表id不能为空',
    })
    tableId: number;

}
