import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../entities/genColumns.entity';
import { GenTableEntity } from '../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from './feTempsFactory';
export class FeElementPlusTemp extends FeTempsFactory {
    entity: GenTableEntity;
    // 搜索列表
    queryList: GenColumnsEntity[];
    // 必填列表
    requiredList: GenColumnsEntity[];
    // 表格列表
    tableList: GenColumnsEntity[];
    constructor(entity: GenTableEntity) {
        super(entity);
        this.entity = entity;
        this.queryList = this.entity.columns.filter(it => it.isQuery);
        this.requiredList = this.entity.columns.filter(it => it.required);
        this.tableList = this.entity.columns.filter(it => it.isList);
    }
    // 生成搜索栏代码
    genQueryString() {
        const queryList = this.queryList;
        return `${queryList
            .map(it => {
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                    case ColumnsHTMLType.textarea:
                        return `
            <el-form-item label="${it.desc}" prop="${it.name}">
                <el-input
                    v-model="queryParams.${it.name}"
                    placeholder="请输入${it.desc}"
                    clearable
                    style="width: 240px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>`;
                    case ColumnsHTMLType.select:
                    case ColumnsHTMLType.checkbox:
                    case ColumnsHTMLType.radio:
                        return ` 
            <el-form-item label="${it.desc}" prop="${it.name}">
                <el-select v-model="queryParams.${it.name}" placeholder="请选择${it.desc}" clearable style="width: 240px" @change="handleQuery">
                    <el-option
                        v-for="item in ${it.name}Group"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>`;
                    default:
                        return '';
                }
            })
            .join('')}
    `;
    }
    genTableColunmString() {
        const list = this.tableList;
        return `${list
            .map(it => {
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                    case ColumnsHTMLType.textarea:
                        return `
            <el-table-column label="${it.desc}" align="center" prop="${it.name}" show-overflow-tooltip />`;
                    case ColumnsHTMLType.select:
                    case ColumnsHTMLType.radio:
                        return `
            <el-table-column label="${it.desc}" align="center" prop="${it.name}">
                <template #default="scope">
                    <template v-for="item in ${it.name}Group">
                        <template v-if="scope.row.${it.name} === item.value">
                            <el-tag :key="item.label">{{ item.label }}</el-tag>
                        </template>
                    </template>
                </template>
            </el-table-column>`;
                    case ColumnsHTMLType.checkbox:
                        return `
            <el-table-column label="${it.desc}" align="center" prop="${it.name}">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.${it.name}" :key="item" class="ml-2">{{ item }}</el-tag>
                </template>
            </el-table-column>`;
                    case ColumnsHTMLType.datetime:
                        return `
            <el-table-column label="${it.desc}" align="center" prop="${it.name}" width="180">
                <template #default="scope">
                    <span>{{ dateFormat(scope.row.${it.name}) }}</span>
                </template>
            </el-table-column>`;
                    default:
                        return ``;
                }
            })
            .join('')}`;
    }
    genFormStringFactory() {
        const list = this.entity.columns.filter(it => it.isInsert || it.isEdit);
        return `${list
            .map(it => {
                let showStr = '';
                let disabledStr = '';

                if (it.isEdit && !it.isInsert) {
                    showStr = `v-if="!isAddDialog" `;
                } else if (!it.isEdit && it.isInsert) {
                    disabledStr = `:disabled="!isAddDialog" `;
                }
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                        return `
                <el-form-item ${showStr}label="${it.desc}" prop="${it.name}">
                    <el-input v-model="editForm.${it.name}" ${disabledStr}placeholder="请输入${it.desc}" />
                </el-form-item>`;
                    case ColumnsHTMLType.textarea:
                        return `
                <el-form-item ${showStr}label="${it.desc}" prop="${it.name}">
                    <el-input v-model="editForm.${it.name}" type="textarea" ${disabledStr}placeholder="请输入${it.desc}内容"></el-input>
                </el-form-item>`;
                    case ColumnsHTMLType.select:
                        return `
                <el-form-item ${showStr}label="${it.desc}" prop="${it.name}">
                    <el-select v-model="editForm.${it.name}" ${disabledStr}placeholder="请选择${it.desc}">
                        <el-option
                            v-for="item in ${it.name}Group"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>`;
                    case ColumnsHTMLType.radio:
                        return `
                <el-form-item ${showStr}label="${it.desc}" prop="${it.name}">
                    <el-radio-group v-model="editForm.${it.name}" ${disabledStr}>
                        <el-radio v-for="it in ${it.name}Group" :key="it.label" :label="it.value">{{
                            it.label
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>`;
                    case ColumnsHTMLType.checkbox:
                        return `
                <el-form-item ${showStr}label="${it.desc}" prop="${it.name}">
                    <el-checkbox-group v-model="editForm.${it.name}" ${disabledStr}>
                        <el-checkbox v-for="it in ${it.name}Group" :key="it.label" :label="it.value">{{
                            it.label
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>`;
                    case ColumnsHTMLType.datetime:
                        return `
                <el-form-item ${showStr}label="${it.desc}" prop="${it.name}">
                    <el-date-picker v-model="editForm.${it.name}" type="date" placeholder="请选择日期"  ${disabledStr}/>
                </el-form-item>`;
                    default:
                        return ``;
                }
            })
            .join('')}`;
    }
    /**
     * 生成下拉单选的数据组
     */
    genGroupString() {
        const list = this.entity.columns.filter(
            it =>
                it.htmlType === ColumnsHTMLType.radio ||
                it.htmlType === ColumnsHTMLType.checkbox ||
                it.htmlType === ColumnsHTMLType.select
        );
        return `${list
            .map(it => {
                if (it.tsType === ColumnsType.boolean) {
                    return `
const ${it.name}Group = [
    { label: '是', value: true },
    { label: '否', value: false },
];`;
                }
                return `
const ${it.name}Group = [${it.enumValues
                    .map(
                        enumValue => `
    { label: '${enumValue}', value: '${enumValue}' },`
                    )
                    .join('')}
];`;
            })
            .join('')}`;
    }
    /**
     * 生成form内的字段
     */
    genFormColumns(isReset = false) {
        const list = this.entity.columns.filter(it => it.isInsert || it.isEdit);
        return `${list
            .map(it => {
                switch (it.tsType) {
                    case 'string':
                    case 'Date':
                        return `
    ${isReset ? '   ' : ''}${it.name}: '',`;
                    case 'number':
                        return `
    ${isReset ? '   ' : ''}${it.name}: 0,`;
                    case 'boolean':
                        return `
    ${isReset ? '   ' : ''}${it.name}: false,`;
                }
            })
            .join('')}`;
    }
    genString() {
        // 搜索表单
        const queryStr = this.genQueryString();
        // 表格
        const tableColunmString = this.genTableColunmString();
        // 添加表单
        const addFormString = this.genFormStringFactory();
        //
        const groupString = this.genGroupString();
        const formColumnsString = this.genFormColumns();
        const resetFormColumnsString = this.genFormColumns(true);
        // 表名
        const tableName = lowerFirst(this.entity.name.replace(/Entity$/, ''));
        const TableName = upperFirst(tableName);
        const queryList = this.queryList;
        const requiredList = this.requiredList;

        return `<template>
    <div class="app-container">
        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">${queryStr}
            <el-form-item label="创建时间" style="width: 308px">
                <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
                <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb-2">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    :icon="Plus"
                    @click="handleAdd"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    :icon="Delete"
                    :disabled="multiple"
                    @click="handleDelete()"
                    >删除</el-button
                >
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- ${this.entity.desc} -->
        <el-table ref="tableRef" v-loading="loading" :data="${tableName}List" :max-height="height - top - 116" @selectionChange="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />${tableColunmString}
        
            <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
                <template #default="scope">
                    <span>{{ dateFormat(scope.row.createdAt) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        :icon="Edit"
                        @click="handleUpdate(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        link
                        type="primary"
                        :icon="Delete"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            v-model:page="queryLimit.page"
            v-model:limit="queryLimit.psize"
            :total="total"
            @pagination="getList"
        />
        <!-- 添加/修改对话框 -->
        <el-dialog
            v-model="editDialogVisible"
            :title="isAddDialog ? '添加${this.entity.desc}' : '修改${this.entity.desc}'"
            width="500px"
            append-to-body
        >
            <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="80px">${addFormString}
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="${TableName}" lang="ts">
import { dateFormat } from '@zeronejs/utils';
import { ref } from 'vue';
import { ElMessage, FormInstance, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue';
import { endOfDay } from 'date-fns';
import { useElementBounding, useWindowSize } from '@vueuse/core';
// 接口
import type { ${TableName}CreateDto, ${TableName}Entity, ${TableName}ListWhereDto, DeepRequired } from '@/api/interface';
import {
    post${TableName},
    patch${TableName}ById,
    get${TableName},
    get${TableName}ById,
    delete${TableName}ById,
} from '@/api/controller';

// 搜索栏
const queryRef = ref<FormInstance>();
// table列表
const tableRef = ref<TableInstance>();
// 用于计算table高度
const { top } = useElementBounding(tableRef as any);
const { height } = useWindowSize();

const ${tableName}List = ref<DeepRequired<${TableName}Entity[]>>([]);

// 列表loading
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
// 单选
const single = ref(true);
// 是否选中了数据
const multiple = ref(true);
// 创建日期
const dateRange = ref<[Date, Date]>();
${groupString}

const queryLimit = ref({
    page: 1,
    psize: 10,
});
const total = ref(0);
// 列表请求参数
const queryParams = ref<${TableName}ListWhereDto>({${queryList
            .map(
                it => `
    ${it.name}: undefined,`
            )
            .join('')}
});

/** 获取列表 */
const getList = async () => {
    loading.value = true;
    const createAtWhere = !dateRange.value
        ? undefined
        : [dateRange.value[0]?.toISOString(), endOfDay(dateRange.value[1]).toISOString()];
    try {
        const { data } = await get${TableName}({
            query: { ...queryParams.value },
            page: queryLimit.value.page,
            size: queryLimit.value.psize,
        });
        loading.value = false;
        ${tableName}List.value = data.data.content;
        total.value = data.data.totalElements;
    } catch (e) {
        console.error(e);
        loading.value = false;
    }
};
getList();
/** 搜索按钮操作 */
const handleQuery = () => {
    queryLimit.value.page = 1;
    getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
    dateRange.value = undefined;
    queryRef.value?.resetFields();
    handleQuery();
};

/**
 * 编辑表单
 */
const editDialogVisible = ref(false);
const isAddDialog = ref(true);
const editFormRef = ref<FormInstance>();
const fromId = ref(0);
const rules = {${requiredList
            .map(
                it => `
    ${it.name}: [{ required: true, message: '${it.desc}不能为空', trigger: 'blur' }],`
            )
            .join('')}
};
const editForm = ref<${TableName}CreateDto>({${formColumnsString}
});
/** 新增按钮操作 */
const handleAdd = () => {
    reset();
    editDialogVisible.value = true;
    isAddDialog.value = true;
};
/** 取消按钮 */
function cancel() {
    editDialogVisible.value = false;
    reset();
}
/** 表单重置 */
function reset() {
    editForm.value = {${resetFormColumnsString}
    };
    fromId.value = 0;
    editFormRef.value?.resetFields();
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: DeepRequired<${TableName}Entity[]>) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length !== 1;
    multiple.value = !selection.length;
};
/** 修改按钮操作 */
const handleUpdate = async (row: DeepRequired<${TableName}Entity>) => {
    reset();
    isAddDialog.value = false;
    const selectId = row ? row.id : ids.value[0];
    // 如果需要从接口获取详情
    const { data } = await get${TableName}ById({ id: selectId });
    fromId.value = selectId;
    editForm.value = data.data;
    editDialogVisible.value = true;
};

const submitLoading = ref(false);
/** 提交按钮 */
const submitForm = async () => {
    try {
        await editFormRef.value?.validate();
    } catch (e) {
        return console.error(e);
    }
    submitLoading.value = true;
    try {
        if (!fromId.value) {
            // 新增
            await post${TableName}(editForm.value);
        } else {
            // 修改
            await patch${TableName}ById({ id: fromId.value }, editForm.value);
        }
        submitLoading.value = false;
        ElMessage.success('操作成功');
        editDialogVisible.value = false;
        getList();
    } catch (e) {
        submitLoading.value = false;
        console.error(e);
    }
};
/** 删除按钮操作 */
const handleDelete = async (row?: DeepRequired<${TableName}Entity>) => {
    const selectIds = row ? [row.id] : ids.value;
    try {
        await ElMessageBox.confirm('是否确认删除编号为"' + selectIds.join(',') + '"的数据项？', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    await Promise.all(
                        selectIds.map(id => {
                            return delete${TableName}ById({ id });
                        })
                    );
                    done();
                    getList();
                    ElMessage.success('删除成功');
                } else {
                    done();
                }
            },
        });
    } catch (e) {
        return console.error(e);
    }
};
</script>

`;
    }
}
