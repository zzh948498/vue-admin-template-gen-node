import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BaseEntity,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { GenTableEntity } from './genTable.entity';
export enum ColumnsType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    Date = 'Date',
}
export enum ColumnsHTMLType {
    /**
     * 文本框
     */
    input = 'input',
    /**
     * 文本域
     */
    textarea = 'textarea',
    /**
     * 下拉框
     */
    select = 'select',
    /**
     * 单选框
     */
    radio = 'radio',
    /**
     * 复选框
     */
    checkbox = 'checkbox',
    /**
     * 日期控件
     */
    datetime = 'datetime',
    /**
     * 图片上传
     */
    imageUpload = 'imageUpload',
    /**
     * 文件上传
     */
    fileUpload = 'fileUpload',
    /**
     * 富文本控件
     */
    editor = 'editor',
}
export enum ColumnsHTMLTypeMap{
    input = '文本框',
    textarea = '文本域',
    select = '下拉框',
    radio = '单选框',
    checkbox = '复选框',
    datetime = '日期控件',
    imageUpload = '图片上传',
    fileUpload = '文件上传',
    editor = '富文本控件',
}

/**
 * 代码生成字段表
 */
@Entity()
export class GenColumnsEntity extends BaseEntity {
    /**
     * id
     */

    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 字段名称
     */
    @Column()
    name: string;
    /**
     * 字段描述
     */
    @Column()
    desc: string;
    /**
     * ts类型
     */
    @Column({
        type: 'enum',
        enum: ColumnsType,
    })
    tsType: ColumnsType;

    /**
     * 是否枚举类型
     */
    @Column({
        default: false,
    })
    isEnum: boolean;
    /**
     * 枚举类型的值
     */
    @Column('simple-array')
    enumValues?: string[];
    /**
     * 插入
     */
    @Column({
        default: false,
    })
    isInsert: boolean;
    /**
     * 编辑
     */
    @Column({
        default: false,
    })
    isEdit: boolean;
    /**
     * 列表
     */
    @Column({
        default: false,
    })
    isList: boolean;
    /**
     * 查询
     */
    @Column({
        default: false,
    })
    isQuery: boolean;
    /**
     * 必填
     */
    @Column({
        default: false,
    })
    required: boolean;
    /**
     * html类型
     */
    @Column({
        type: 'enum',
        enum: ColumnsHTMLType,
        default: ColumnsHTMLType.input,
    })
    htmlType: ColumnsHTMLType;

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
    @ManyToOne(() => GenTableEntity, table => table.columns)
    @JoinColumn({ name: 'tableId' })
    table: GenTableEntity;
    /**
     * 表id
     */
    @Column({ name: 'tableId' })
    tableId: number;
}
