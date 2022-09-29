import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { GenTableEntity } from './genTable.entity';

export enum GenTableRelationsEntityTypeEnum {
    OneToOne = 'OneToOne',
    ManyToOne = 'ManyToOne',
    OneToMany = 'OneToMany',
    ManyToMany = 'ManyToMany',
}

/**
 * 代码生成关系表
 */
@Entity()
export class GenTableRelationsEntity extends BaseEntity {
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 子表名称
     */
    @Column()
    subTableName: string;

    /**
     * 子表关系类型
     */
    @Column({
        type: 'enum',
        enum: GenTableRelationsEntityTypeEnum,
    })
    type: GenTableRelationsEntityTypeEnum;

    /**
     * 子表关联的外键名
     */
    @Column({
        nullable: true,
    })
    subTableFkName?: string;
    /**
     * 自身关系字段
     */
    @Column()
    relationColumn: string;
    /**
     * 目标关系字段
     */
    @Column()
    targetColumn: string;

    /**
     * 创建时间
     */
    @CreateDateColumn()
    createdAt: Date;
    /**
     * 修改时间
     */
    @UpdateDateColumn()
    updatedAt: Date;
    /**
     * 表信息
     */
    @ManyToOne(() => GenTableEntity, table => table.relations)
    @JoinColumn({ name: 'tableId' })
    table: GenTableEntity;
    /**
     * 表id
     */
    @Column({ name: 'tableId' })
    tableId: number;
}
