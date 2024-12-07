import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
export class FeGiimeEditDialogTemp extends FeTempsFactory {
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
  ${isReset ? '  ' : ''}${it.name}: '',`;
                    case 'number':
                        return `
  ${isReset ? '  ' : ''}${it.name}: 0,`;
                    case 'boolean':
                        return `
  ${isReset ? '  ' : ''}${it.name}: false,`;
                }
            })
            .join('')}`;
    }
    genString() {
        // 表名
        const tableName = lowerFirst(this.entity.name.replace(/Entity$/, ''));
        const TableName = upperFirst(tableName);
        const queryList = this.queryList;
        const requiredList = this.requiredList;
        const formColumnsString = this.genFormColumns();
        const resetFormColumnsString = this.genFormColumns(true);

        return `<template>
  <!-- 添加/修改对话框 -->
  <gm-dialog v-model="editDialogVisible" :title="isAddDialog ? '添加${this.entity.desc}' : '修改${this.entity.desc}'" width="500px" append-to-body @closed="cancel">
    <EditForm ref="editFormRef" v-model:editForm="editForm" @getList="emit('getList')" />
    <template #footer>
      <div class="dialog-footer">
        <gm-button type="primary" :loading="submitLoading" @click="submitForm">确 定</gm-button>
        <gm-button @click="cancel">取 消</gm-button>
      </div>
    </template>
  </gm-dialog>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { resetObject } from 'giime';
import EditForm from './EditForm.vue';
import type { Post${this.apiPrefix}AddInput, Post${this.apiPrefix}ListResultDataRecords } from '${this.dto.apiController}';
import { post${this.apiPrefix}Add, post${this.apiPrefix}Edit } from '${this.dto.apiController}';

const emit = defineEmits<{
  (e: 'getList'): Promise<any>;
}>();

/**
 * 编辑表单
 */
const editDialogVisible = ref(false);
const isAddDialog = ref(true);
const editFormRef = ref<InstanceType<typeof EditForm>>();
const fromId = ref(0);
const defaultEditForm: Post${this.apiPrefix}AddInput = {${formColumnsString}
};
const editForm = ref(cloneDeep(defaultEditForm));

/** 新增按钮操作 */
const openAddForm = () => {
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
  fromId.value = 0;
  // 表单加载可能有延迟   会导致重置失败
  // editFormRef.value?.resetFields?.();
  // 手动重置
  editForm.value = cloneDeep(defaultEditForm);
}

/** 修改按钮操作 */
const openUpdateForm = (row: Post${this.apiPrefix}ListResultDataRecords) => {
  reset();
  isAddDialog.value = false;
  // 如果需要从接口获取详情
  // const { data } = await getItemById({ id: selectId });
  fromId.value = row.id;
  resetObject(editForm.value, row);
  editDialogVisible.value = true;
};

const submitLoading = ref(false);
/** 提交按钮 */
const submitForm = async () => {
  try {
    await editFormRef.value?.validate?.();
  } catch (e) {
    return console.error(e);
  }
  submitLoading.value = true;
  try {
    let res: { data: { code: number } };
    if (!fromId.value) {
      // 新增
      res = await post${this.apiPrefix}Add(editForm.value);
    } else {
      // 修改
      res = await post${this.apiPrefix}Edit({ ...editForm.value, id: fromId.value });
    }
    submitLoading.value = false;
    if (res.data.code !== 200) {
      return;
    }
    GmMessage.success('操作成功');
    editDialogVisible.value = false;
    emit('getList');
  } catch (e) {
    submitLoading.value = false;
    console.error(e);
  }
};
defineExpose({
  openAddForm,
  openUpdateForm,
});
</script>
`;
    }
}
