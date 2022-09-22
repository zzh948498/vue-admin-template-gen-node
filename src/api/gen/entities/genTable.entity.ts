import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { GenColumnsEntity } from './genColumns.entity';
export enum TemplateCategory {
    crud = 'crud',
    tree = 'tree',
    sub = 'sub',
}
export enum TableRelations {
    OneToOne = 'OneToOne',
    ManyToOne = 'ManyToOne',
    OneToMany = 'OneToMany',
    ManyToMany = 'ManyToMany',
}
/**
 * 代码生成信息表
 */
@Entity()
export class GenTableEntity extends BaseEntity {
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;
    /**
     * 表名称
     */
    @Column({ unique: true })
    name: string;

    /**
     * 表描述
     */
    @Column()
    desc: string;
    /**
     * 备注
     */
    @Column({ nullable: true })
    remark?: string;

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
     * 字段
     */
    @OneToMany(() => GenColumnsEntity, column => column.table)
    columns: GenColumnsEntity[];

    /**
     * 生成模板类型
     */
    @Column({
        type: 'enum',
        enum: TemplateCategory,
    })
    tplCategory: TemplateCategory;
    /**
     * 子表名称
     */
    @Column({ default: '' })
    subTableName?: string;
    /**
     * 子表关系类型
     */
    @Column({
        type: 'enum',
        enum: TableRelations,
        nullable: true,
    })
    relations?: TableRelations;
    /**
     * 子表关联的外键名
     */
    @Column({ default: '' })
    subTableFkName?: string;
}
