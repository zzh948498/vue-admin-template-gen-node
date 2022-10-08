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
import { DictEntity } from './dict.entity';

export enum DictDataEntityStatusEnum {
    Normal,
    Disable,
}

/**
 * 字典数据表
 */
@Entity()
export class DictDataEntity extends BaseEntity {
    /**
     * id
     */
    @PrimaryGeneratedColumn()
    id: number;
    
    /**
     * 字典标签
     */
    @Column()
    label: string;
    
    /**
     * 字典排序
     */
    @Column()
    sort: number;
    
    /**
     * 是否默认
     */
    @Column({
        nullable: true,
    })
    isDefault?: boolean;
    
    /**
     * 字典键值
     */
    @Column()
    value: string;
    
    /**
     * 状态（0正常 1停用）
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: DictDataEntityStatusEnum,
    })
    status?: DictDataEntityStatusEnum;
    
    /**
     * 备注
     */
    @Column({
        nullable: true,
    })
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
     * dict
     */
    @ManyToOne(() => DictEntity, dict => dict.dictDatas)
    @JoinColumn({ name: 'dictId' }) 
    dict: DictEntity;
                    
    /**
     * dictId
     */
    @Column({ name: 'dictId' })
    dictId: number; 
    
}

