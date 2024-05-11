import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { randomUUID } from 'crypto';
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
  <div>
    <gm-row :gutter="10" class="mb-2">
      <gm-col :span="1.5">
        <gm-button type="primary" plain :icon="Plus" @click="emits('optionAddForm')">新增</gm-button>
      </gm-col>
      <gm-col :span="1.5">
        <gm-button type="danger" plain :icon="Delete" :disabled="notSelected" @click="emits('batchDelete')">删除</gm-button>
      </gm-col>

      <right-toolbar v-model:showSearch="showSearch" @queryTable="emits('getList')" />
    </gm-row>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Plus } from '@element-plus/icons-vue';
defineProps<{
  notSelected: boolean;
}>();
const emits = defineEmits<{
  (e: 'optionAddForm'): void;
  (e: 'batchDelete'): void;
  (e: 'getList'): Promise<any>;
}>();

const showSearch = defineModel<boolean>('showSearch', { required: true });
</script>
`;
    }
}
