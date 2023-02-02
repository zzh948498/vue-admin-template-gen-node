import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { DictDataEntity } from './dictData.entity';

export enum DictEntityStatusEnum {
    Normal = 'Normal',
    Disable = 'Disable',
}

/**
 * 字典
 */
@Entity()
export class DictEntity extends BaseEntity {
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 字典名称
     */
    @Column()
    title: string;

    /**
     * 状态
     */
    @Column({
        type: 'enum',
        enum: DictEntityStatusEnum,
    })
    status: DictEntityStatusEnum;

    /**
     * 备注
     */
    @Column({
        nullable: true,
    })
    remark?: string;

    /**
     * 字典类型
     */
    @Column()
    type: string;

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
     * dictDatas
     */
    @OneToMany(() => DictDataEntity, dictDatas => dictDatas.dict)
    dictDatas: DictDataEntity[];
}
