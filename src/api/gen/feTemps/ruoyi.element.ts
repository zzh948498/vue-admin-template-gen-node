import { ColumnsHTMLType, ColumnsType } from '../entities/genColumns.entity';
import { GenTableEntity } from '../entities/genTable.entity';
import { upperFirst } from 'lodash';
export class FeRuoYiElementTemp {
    entity: GenTableEntity;
    constructor(entity: GenTableEntity) {
        this.entity = entity;
    }
    // 生成搜索栏代码
    genQueryString() {
        const queryList = this.entity.columns.filter(it => it.isQuery);
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
                    case ColumnsHTMLType.radio:
                        return ` 
            <el-form-item label="${it.desc}" prop="${it.name}">
                <el-select v-model="queryParams.${it.name}" placeholder="请选择${it.desc}" clearable style="width: 240px">
                    <el-option
                        v-for="item in ${it.name}Group"
                        :key="item.value"
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
        const list = this.entity.columns.filter(it => it.isList);
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
                            <el-tag :key="item.value">{{ item.label }}</el-tag>
                        </template>
                    </template>
                </template>
            </el-table-column>`;
                    default:
                        return ``;
                }
            })
            .join('')}`;
    }
    genFormStringFactory(formType: 'add' | 'update') {
        const list = this.entity.columns.filter(it => {
            switch (formType) {
                case 'add':
                    return it.isInsert;
                case 'update':
                    return it.isEdit;
            }
        });
        let formName = '';
        switch (formType) {
            case 'add':
                formName = 'addForm';
            case 'update':
                formName = 'updateForm';
        }
        return `${list
            .map(it => {
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                        return `
                <el-form-item label="${it.desc}" prop="${it.name}">
                    <el-input v-model="${formName}.${it.name}" placeholder="请输入${it.desc}" />
                </el-form-item>`;
                    case ColumnsHTMLType.textarea:
                        return `
                <el-form-item label="${it.desc}" prop="${it.name}">
                    <el-input v-model="${formName}.${it.name}" type="textarea" placeholder="请输入${it.desc}内容"></el-input>
                </el-form-item>`;
                    case ColumnsHTMLType.select:
                        return `
                <el-form-item label="${it.desc}" prop="${it.name}">
                    <el-select v-model="${formName}.${it.name}" placeholder="请选择${it.desc}">
                        <el-option
                            v-for="item in ${it.name}Group"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>`;
                    case ColumnsHTMLType.radio:
                        return `
                <el-form-item label="状态" prop="${it.name}">
                    <el-radio-group v-model="${formName}.${it.name}">
                        <el-radio v-for="it in ${it.name}Group" :key="it.value" :label="it.value">{{
                            it.label
                        }}</el-radio>
                    </el-radio-group>
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
                if(it.tsType ===ColumnsType.boolean){
                    return `
const ${it.name}Group = [
    { label: '是', value: true },
    { label: '否', value: false },
];`
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
    genString() {
        // 搜索表单
        const queryStr = this.genQueryString();
        // 表格
        const tableColunmString = this.genTableColunmString();
        // 添加表单
        const addFormString = this.genFormStringFactory('add');
        // 更新表单
        const updateFormString = this.genFormStringFactory('update');
        //
        const groupString = this.genGroupString();
        // 表名
        const tableName = this.entity.name.replace(/Entity$/, '');
        const TableName = upperFirst(tableName);
        const queryList = this.entity.columns.filter(it => it.isQuery);
        const requiredList = this.entity.columns.filter(it => it.required);
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
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['system:${tableName}:add']"
                    type="primary"
                    plain
                    icon="Plus"
                    @click="handleAdd"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['system:${tableName}:edit']"
                    type="success"
                    plain
                    icon="Edit"
                    :disabled="single"
                    @click="handleUpdate()"
                    >修改</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['system:${tableName}:remove']"
                    type="danger"
                    plain
                    icon="Delete"
                    :disabled="multiple"
                    @click="handleDelete()"
                    >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['system:${tableName}:export']"
                    type="warning"
                    plain
                    icon="Download"
                    @click="handleExport"
                    >导出</el-button
                >
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- ${this.entity.desc} -->
        <el-table v-loading="loading" :data="${tableName}List" @selectionChange="handleSelectionChange">${tableColunmString}
            <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
                <template #default="scope">
                    <span>{{ dateFormat(scope.row.createdAt) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button
                        v-hasPermi="['system:${tableName}:edit']"
                        link
                        type="primary"
                        icon="Edit"
                        @click="handleUpdate(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        v-hasPermi="['system:${tableName}:remove']"
                        link
                        type="primary"
                        icon="Delete"
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

        <!-- 添加对话框 -->
        <el-dialog v-model="addDialogVisible" title="添加字典类型" width="500px" append-to-body>
            <el-form ref="add${TableName}Ref" :model="addForm" :rules="rules" label-width="80px">${addFormString}
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitAddForm">确 定</el-button>
                    <el-button @click="addCancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 修改参数配置对话框 -->
        <el-dialog v-model="updateDialogVisible" title="修改字典类型" width="500px" append-to-body>
            <el-form ref="update${TableName}Ref" :model="updateForm" :rules="rules" label-width="80px">${updateFormString}
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitUpdateForm">确 定</el-button>
                    <el-button @click="updateCancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="${TableName}" lang="ts">
import { dateFormat } from '@zeronejs/utils';
import { ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { ElModalConfirm } from '@/plugins/ElModal';
import { endOfDay } from 'date-fns';
import { download } from '@/utils/request';
import { cloneDeep } from 'lodash';
// 接口
import type { ${TableName}CreateDto, ${TableName}Entity, ${TableName}ListWhereDto, ${TableName}UpdateDto } from '@/api/interface';
import {
    post${TableName}Create,
    patch${TableName}UpdateById,
    post${TableName}List,
    get${TableName}DetailsById,
    post${TableName}Removes,
} from '@/api/controller';

// 搜索栏
const queryRef = ref<FormInstance>();

const ${tableName}List = ref<${TableName}Entity[]>([]);

// 列表loading
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
// 单选
const single = ref(true);
// 是否选中了数据
const multiple = ref(true);
const total = ref(0);
// 创建日期
const dateRange = ref<[Date, Date]>();
${groupString}

const queryLimit = ref({
    page: 1,
    psize: 10,
});
// 列表请求参数
const queryParams = ref<${TableName}ListWhereDto>({${queryList
            .map(
                it => `
    ${it.name}: undefined,`
            )
            .join('')}
});
const rules = {${requiredList
            .map(
                it => `
    ${it.name}: [{ required: true, message: '${it.desc}不能为空', trigger: 'blur' }],`
            )
            .join('')}
};

/** 查询字典类型列表 */
const getList = async () => {
    loading.value = true;
    const createAtWhere = !dateRange.value
        ? undefined
        : [dateRange.value[0]?.toISOString(), endOfDay(dateRange.value[1]).toISOString()];

    const { data } = await post${TableName}List({
        where: {
            ...queryParams.value,
            createdAt: createAtWhere,
        },
        limit: queryLimit.value,
    });
    ${tableName}List.value = data.data;
    total.value = data.total;
    loading.value = false;
};
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
// 新增/编辑弹窗通用逻辑
const use${TableName}Dialog = <T extends ${TableName}CreateDto | ${TableName}UpdateDto>(initFormValue: T) => {
    const ${tableName}Ref = ref<FormInstance>();
    const dialogVisible = ref(false);
    const editForm = ref(cloneDeep(initFormValue));
    /** 取消按钮 */
    const cancel = () => {
        dialogVisible.value = false;
        reset();
    };
    /** 表单重置 */
    const reset = () => {
        fromId.value = 0;
        editForm.value = cloneDeep(initFormValue);
        ${tableName}Ref.value?.resetFields();
    };

    return {
        ${tableName}Ref,
        dialogVisible,
        editForm,
        cancel,
        reset,
    };
};
const fromId = ref(0);

const initAddFormValue: ${TableName}CreateDto = {
    title: '',
    status: 'Normal',
    remark: '',
    type: '',
};
const initUpadteFormValue: ${TableName}UpdateDto = {
    title: '',
    status: 'Normal',
    remark: '',
    type: '',
};

/** 新增表单相关 */
const {
    ${tableName}Ref: add${TableName}Ref,
    dialogVisible: addDialogVisible,
    editForm: addForm,
    cancel: addCancel,
    reset: addReset,
} = use${TableName}Dialog(initAddFormValue);
/** 编辑表单相关 */
const {
    ${tableName}Ref: update${TableName}Ref,
    dialogVisible: updateDialogVisible,
    editForm: updateForm,
    cancel: updateCancel,
    reset: updateReset,
} = use${TableName}Dialog(initUpadteFormValue);
/** 提交添加表单 */
const submitAddForm = async () => {
    try {
        await add${TableName}Ref.value?.validate();
    } catch (e) {
        return console.log(e);
    }
    await post${TableName}Create(addForm.value);
    ElMessage.success('新增成功');
    addDialogVisible.value = false;
    getList();
};
/** 提交修改表单 */
const submitUpdateForm = async () => {
    try {
        await update${TableName}Ref.value?.validate();
    } catch (e) {
        return console.log(e);
    }
    await patch${TableName}UpdateById({ id: fromId.value }, updateForm.value);
    ElMessage.success('修改成功');
    updateDialogVisible.value = false;
    getList();
};
/** 新增按钮操作 */
const handleAdd = () => {
    addReset();
    addDialogVisible.value = true;
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: ${TableName}Entity[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length !== 1;
    multiple.value = !selection.length;
};
/** 修改按钮操作 */
const handleUpdate = async (row?: ${TableName}Entity) => {
    updateReset();
    const ${tableName}Id = row ? row.id : ids.value[0];

    const { data } = await get${TableName}DetailsById({ id: ${tableName}Id });
    fromId.value = ${tableName}Id;
    updateForm.value = data.data;
    updateDialogVisible.value = true;
};

/** 删除按钮操作 */
const handleDelete = async (row?: ${TableName}Entity) => {
    const ${tableName}Ids = row ? [row.id] : ids.value;
    try {
        await ElModalConfirm('是否确认删除字典编号为"' + ${tableName}Ids.join(',') + '"的数据项？');
    } catch (e) {
        return console.log(e);
    }
    await post${TableName}Removes({ ids: ${tableName}Ids });
    getList();
    ElMessage.success('删除成功');
};
/** 导出按钮操作 */
function handleExport() {
    download(
        'system/${tableName}/type/export',
        {
            ...queryParams.value,
        },
        \`${tableName}_\${new Date().getTime()}.xlsx\`
    );
}

getList();
</script>

`;
    }
}
