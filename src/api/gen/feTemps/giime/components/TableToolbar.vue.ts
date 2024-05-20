import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
export class FeGiimeTableToolbarTemp extends FeTempsFactory {
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

    genString() {
        // 表名
        const tableName = lowerFirst(this.entity.name.replace(/Entity$/, ''));
        const TableName = upperFirst(tableName);
        const queryList = this.queryList;
        const requiredList = this.requiredList;
        return `<template>
  <div class="mb-3">
    <gm-table-toolbar v-model:showSearch="showSearch" v-model:queryParams="queryParams" :tableId="tableId" @getList="emits('getList')">
      <gm-col :span="1.5">
        <gm-button type="primary" plain :icon="Plus" @click="emits('optionAddForm')">新增</gm-button>
      </gm-col>
      <gm-col :span="1.5">
        <gm-button type="danger" plain :icon="Delete" :disabled="notSelected" @click="emits('batchDelete')">删除</gm-button>
      </gm-col>
    </gm-table-toolbar>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Plus } from '@element-plus/icons-vue';
import { use${TableName}Options } from '../composables/use${TableName}Options';
import type { Post${this.apiPrefix}ListInput } from '${this.dto.apiController}';
defineProps<{
  notSelected: boolean;
}>();
const emits = defineEmits<{
  (e: 'optionAddForm'): void;
  (e: 'batchDelete'): void;
  (e: 'getList'): Promise<any>;
}>();

const showSearch = defineModel<boolean>('showSearch', { required: true });
const queryParams = defineModel<Post${this.apiPrefix}ListInput>('queryParams', { required: true });

const { tableId } = use${TableName}Options();
</script>
`;
    }
}
