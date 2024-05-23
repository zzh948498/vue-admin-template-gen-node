import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../entities/genColumns.entity';
import { GenTableEntity } from '../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../feTempsFactory';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
export class FeGiimeIndexTemp extends FeTempsFactory {
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
    genQueryParams() {
        const queryList = this.queryList;
        return `${queryList
            .map(it => {
                switch (it.tsType) {
                    case ColumnsType.Date:
                        return `
  ${it.name}: [],`;
                    case ColumnsType.boolean:
                        return `
  ${it.name}: false,`;
                    case ColumnsType.number:
                        return `
  ${it.name}: 0,`;
                    case ColumnsType.string:
                        return `
  ${it.name}: undefined,`;
                    default:
                        return '';
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
        const queryParamsStr = this.genQueryParams();
        return `<template>
  <div class="p-5">
    <!-- 搜索 -->
    <Search v-model:queryParams="queryParams" :showSearch="showSearch" @getList="getList" />
    <!-- 工具栏 -->
    <TableToolbar
      v-model:showSearch="showSearch"
      v-model:queryParams="queryParams"
      :notSelected="notSelected"
      @optionAddForm="editDialogRef?.optionAddForm"
      @batchDelete="handleDelete()"
      @getList="getList"
    />
    <!-- 表格 -->
    <Table
      v-loading="isLoading"
      :listData="listData"
      @selectionChange="handleSelectionChange"
      @handleDelete="handleDelete"
      @openUpdateForm="editDialogRef?.openUpdateForm"
    />
    <!-- 分页 -->
    <Pagination v-show="total > 0" v-model:page="queryParams.current" v-model:limit="queryParams.size" :total="total" @pagination="getList" />
    <!-- 编辑弹窗 -->
    <EditDialog ref="editDialogRef" @getList="emit('getList')" />
  </div>
</template>

<script setup lang="ts">
import EditDialog from './components/EditDialog.vue';
import Search from './components/Search.vue';
import Table from './components/Table.vue';
import TableToolbar from './components/TableToolbar.vue';

// 接口
import type { Post${this.apiPrefix}ListInput, Post${this.apiPrefix}ListResultDataRecords } from '${this.dto.apiController}';
import { post${this.apiPrefix}Delete, usePost${this.apiPrefix}List } from '${this.dto.apiController}';
const editDialogRef = ref<InstanceType<typeof EditDialog>>();

// 打开搜索模块
const showSearch = ref(true);
const selectedIds = ref<number[]>([]);
// 多选
const isMultiple = ref(false);
// 未选中
const notSelected = ref(true);

const total = ref(0);
// 列表请求参数
const queryParams = ref<Post${this.apiPrefix}ListInput>({${queryParamsStr}
  /** 当前页 */
  current: 1,
  /** 每页显示条数 */
  size: 10,
});
const listData = ref<Post${this.apiPrefix}ListResultDataRecords[]>([]);
const { isLoading, exec: getListExec } = usePost${this.apiPrefix}List();
/** 获取列表 */
const getList = async () => {
  const { data } = await getListExec(queryParams.value);
  if (data.value?.code !== 200) {
    return;
  }
  listData.value = data.value?.data.records || [];
  total.value = data.value?.data.total || 0;
};
getList();

/** 多选框选中数据 */
const handleSelectionChange: (value: any[]) => any = (selection: Post${this.apiPrefix}ListResultDataRecords[]) => {
  selectedIds.value = selection.map(item => item.id);
  isMultiple.value = selection.length !== 1;
  notSelected.value = !selection.length;
};

/** 删除按钮操作 */
const handleDelete = async (row?: Post${this.apiPrefix}ListResultDataRecords) => {
  const selectIds = row ? [row.id] : selectedIds.value;
  GmConfirmBox({ message: \`是否确认删除编号为"\${selectIds.join(',')}"的数据项？\` }, async () => {
    const { data } = await post${this.apiPrefix}Delete({ id: selectIds.join(',') });
    if (data.code !== 200) {
      return;
    }
    GmMessage.success('删除成功');
    getList();
  });
 
};
</script>
`;
    }
}
