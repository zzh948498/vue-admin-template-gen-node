import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
export class FeGiimeSearchTemp extends FeTempsFactory {
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
    // 生成搜索栏代码
    genQueryString() {
        const queryList = this.queryList;
        return `${queryList
            .map(it => {
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                    case ColumnsHTMLType.textarea:
                        return `
      <gm-search-form-input prop="${it.name}" label="${it.desc}" />`;
                    case ColumnsHTMLType.select:
                    case ColumnsHTMLType.checkbox:
                    case ColumnsHTMLType.radio:
                        return `
      <gm-search-form-select prop="${it.name}" label="${it.desc}" :options="${it.name}Options" />`;
                    case ColumnsHTMLType.datetime:
                        return `
      <gm-search-form-date-picker prop="${it.name}" label="${it.desc}" type="daterange" />`;
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
        // 搜索表单
        const queryStr = this.genQueryString();
        const importOptionsString = this.entity.columns
            .filter(it => it.isQuery && this.optionsTypes.includes(it.htmlType))
            .map(it => it.name + 'Options')
            .join(', ');
        return `<template>
  <section>
    <gm-search-form v-show="showSearch" v-model:query-params="queryParams" @handle-query="handleQuery" @reset-query="resetQuery">${queryStr}
    </gm-search-form>
  </section>
</template>
<script lang="ts" setup>
import { use${TableName}Options } from '../composables/use${TableName}Options';
import type { Post${this.apiPrefix}ListInput } from '${this.dto.apiController}';

defineProps<{
  showSearch: boolean;
}>();
const emits = defineEmits<{
  (e: 'getList'): Promise<any>;
}>();
const { ${importOptionsString} } = use${TableName}Options();
// 列表请求参数
const queryParams = ref<Post${this.apiPrefix}ListInput>({
  name: undefined,
  platform: undefined,
  /** 当前页 */
  current: 1,
  /** 每页显示条数 */
  size: 10,
});
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.current = 1;
  emits('getList');
};
/** 重置按钮操作 */
const resetQuery = () => {
  // queryRef.value?.resetFields();
  handleQuery();
};
defineExpose({
  queryParams,
});
</script>
`;
    }
}
