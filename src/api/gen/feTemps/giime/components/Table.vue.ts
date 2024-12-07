import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { randomUUID } from 'crypto';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
export class FeGiimeTableTemp extends FeTempsFactory {
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
    genTableColunmString() {
        const list = this.tableList;
        return `${list
            .map(it => {
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                    case ColumnsHTMLType.textarea:
                        return `
      <gm-table-column-pro label="${it.desc}" align="left" prop="${it.name}" show-overflow-tooltip width="120" />`;
                    case ColumnsHTMLType.select:
                    case ColumnsHTMLType.radio:
                        return `
      <gm-table-column-pro label="${it.desc}" align="left" prop="${it.name}" width="120">
        <template #default="scope">
          <template v-for="item in ${it.name}Options">
            <template v-if="scope.row.${it.name} === item.value">
              <gm-tag :key="item.label">{{ item.label }}</gm-tag>
            </template>
          </template>
        </template>
      </gm-table-column-pro>`;
                    case ColumnsHTMLType.checkbox:
                        return `
      <gm-table-column-pro label="${it.desc}" align="left" prop="${it.name}" width="120">
        <template #default="scope">
          <gm-tag v-for="item in scope.row.${it.name}" :key="item" class="ml-2">{{ item }}</gm-tag>
        </template>
      </gm-table-column-pro>`;
                    case ColumnsHTMLType.datetime:
                        return `
      <gm-table-column-pro label="${it.desc}" align="left" prop="${it.name}" width="180">
        <template #default="scope">
          <span>{{ scope.row.${it.name} }}</span>
        </template>
      </gm-table-column-pro>`;
                    default:
                        return ``;
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
        // 表格
        const tableColunmString = this.genTableColunmString();
        const importOptionsString = this.entity.columns
            .filter(it => this.optionsTypes.includes(it.htmlType))
            .map(it => it.name + 'Options')
            .join(', ');
        return `<template>
  <div>
    <gm-table-pro :data="listData" :page="tableId" :selection="true" @selectionChange="emit('selectionChange', $event)">${tableColunmString}
      <gm-table-column-pro prop="" type="edit">
        <template #default="{ row }">
          <gm-operate-button label="编辑" prop="edit" type="primary" @click="emit('openUpdateForm', row)" />
          <gm-operate-button label="删除" prop="delete" type="primary" @click="emit('handleDelete', row)" />
        </template>
      </gm-table-column-pro>
    </gm-table-pro>
  </div>
</template>
<script setup lang="ts">
import { use${TableName}Options } from '../composables/use${TableName}Options';
import type { TableInstance } from 'giime';
import type { Post${this.apiPrefix}ListResultDataRecords } from '${this.dto.apiController}';

defineProps<{
  listData: Post${this.apiPrefix}ListResultDataRecords[];
}>();
const emit = defineEmits<{
  (e: 'selectionChange', value: any[]): any;
  (e: 'openUpdateForm', row: Post${this.apiPrefix}ListResultDataRecords): any;
  (e: 'handleDelete', row: Post${this.apiPrefix}ListResultDataRecords): any;
}>();

const { tableId, ${importOptionsString} } = use${TableName}Options();
</script>
`;
    }
}