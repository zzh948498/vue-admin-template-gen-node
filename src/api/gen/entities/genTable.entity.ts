import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { GenColumnsEntity } from './genColumns.entity';
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
    @Index({ unique: true })
    @Column({ unique: true })
    entityName: string;

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

    @OneToMany(() => GenColumnsEntity, column => column.table)
    columns: GenColumnsEntity[];
}
