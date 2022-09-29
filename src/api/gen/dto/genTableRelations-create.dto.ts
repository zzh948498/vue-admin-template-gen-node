import { IsNotEmpty, IsOptional } from 'class-validator';
import { GenTableRelationsEntityTypeEnum } from '../entities/genTableRelations.entity';
export class GenTableRelationsCreateDto {
    /**
     * 子表名称
     */
    @IsNotEmpty({
        message: '子表名称不能为空',
    })
    subTableName: string;

    /**
     * 子表关系类型
     */
    @IsNotEmpty({
        message: '子表关系类型不能为空',
    })
    type: GenTableRelationsEntityTypeEnum;

    /**
     * 子表关联的外键名
     */
    @IsOptional()
    subTableFkName?: string;

    /**
     * 自身关系字段
     */
    @IsNotEmpty({
        message: '自身关系字段不能为空',
    })
    relationColumn: string;

    /**
     * 目标关系字段
     */
    @IsNotEmpty({
        message: '目标关系字段不能为空',
    })
    targetColumn: string;

    /**
     * 表id
     */
    @IsNotEmpty({
        message: '表id不能为空',
    })
    tableId: number;

}
