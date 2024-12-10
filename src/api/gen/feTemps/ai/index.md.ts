import {
    ColumnsHTMLType,
    ColumnsHTMLTypeMap,
    ColumnsType,
    GenColumnsEntity,
} from '../../entities/genColumns.entity';
import { GenTableEntity } from '../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../feTempsFactory';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
export class FeAiIndexMdTemp extends FeTempsFactory {
    entity: GenTableEntity;
    // 搜索列表
    queryList: GenColumnsEntity[];
    // 必填列表
    requiredList: GenColumnsEntity[];
    // 表格列表
    tableList: GenColumnsEntity[];
    constructor(entity: GenTableEntity, public dto: GenTableGenCodeDto) {
        super(entity);
        this.entity = entity;
        this.queryList = this.entity.columns.filter(it => it.isQuery);
        this.requiredList = this.entity.columns.filter(it => it.required);
        this.tableList = this.entity.columns.filter(it => it.isList);
    }
    /**
     * 搜索栏
     */
    genSearch() {
        if (this.dto.hasPRD) {
            return `
1. 根据原型内容，实现搜索条件`;
        }
        return `${this.queryList
            .map(it => {
                return `
- ${it.desc}`;
            })
            .join('')}`;
    }
    /**
     * 表格
     */
    genTable() {
        if (this.dto.hasPRD) {
            return `
1. 根据原型内容，实现表格列`;
        }
        return `${this.tableList
            .map(it => {
                return `
- ${it.desc}`;
            })
            .join('')}`;
    }
    /**
     * 编辑弹窗
     */
    genEditDialog() {
        const fields = this.entity.columns.filter(it => it.isEdit || it.isInsert);
        return `${this.tableList
            .map(it => {
                const isOnlyInsert = it.isInsert && !it.isEdit;
                const isOnlyEdit = it.isEdit && !it.isInsert;

                return `
- ${it.desc}：${it.required ? '必填、' : ''}${isOnlyInsert ? '仅新增、' : ''}${isOnlyEdit ? '仅编辑、' : ''}${
                    ColumnsHTMLTypeMap[it.htmlType]
                }`;
            })
            .join('')}`;
    }

    genString() {
        // 表名
        const tableName = lowerFirst(this.entity.name.replace(/Entity$/, ''));
        // const TableName = upperFirst(tableName);

        const searchStr = this.genSearch();
        const tableStr = this.genTable();
        const editDialogStr = this.genEditDialog();
        return `以下内容是功能清单，请根据描述生成相关代码

# 功能描述

1. 功能名称：${this.entity.desc}
${this.dto.hasPRD ? '2. 产品原型地址：./index.png' : ''}

## 代码目录

1. 页面入口： \`src/views/${tableName}/index.vue\`
2. 模块入口： \`src/modules/${tableName}/index.vue\`

## 搜索条件
${searchStr}

## 表格列
${tableStr}

## 工具栏

1. 新增按钮 打开新增弹窗，调用新增接口
2. 禁用按钮 调用禁用接口

## 操作列

1. 编辑按钮，打开编辑弹窗，调用编辑接口
2. 删除按钮，调用删除接口

## 新增/编辑弹窗

字段说明：
${editDialogStr}

## 请求地址

1. 列表查询请求： ${this.entity.pathPrefix}/page
2. 新增请求： ${this.entity.pathPrefix}/save
3. 修改请求： ${this.entity.pathPrefix}/modify
4. 删除请求： ${this.entity.pathPrefix}/remove

## 接口导入地址

地址：${this.dto.apiController}

## 代码模板

1. 请先执行"zerone ai-md" 终端命令。命令是为了更新模板
2. 执行完毕后 完整读取\`@reqs/templates/base/general.md\` 理解一下通用说明。
3. 通用说明读取完毕后，再完整读取\`@reqs/templates/crud/crud.md\`代码模板
`;
    }
}
