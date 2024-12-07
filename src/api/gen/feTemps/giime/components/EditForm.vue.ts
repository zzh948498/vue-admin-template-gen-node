import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
export class FeGiimeEditFormTemp extends FeTempsFactory {
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
    genFormStringFactory() {
        const list = this.entity.columns.filter(it => it.isInsert || it.isEdit);
        return `${list
            .map(it => {
                let showStr = '';
                let disabledStr = '';

                if (it.isEdit && !it.isInsert) {
                    showStr = `v-if="!isAddDialog" `;
                } else if (!it.isEdit && it.isInsert) {
                    disabledStr = ` :disabled="!isAddDialog"`;
                }
                switch (it.htmlType) {
                    case ColumnsHTMLType.input:
                        return `
      <gm-form-item ${showStr}label="${it.desc}" prop="${it.name}">
        <gm-input v-model="editForm.${it.name}"${disabledStr} placeholder="请输入${it.desc}" />
      </gm-form-item>`;
                    case ColumnsHTMLType.textarea:
                        return `
      <gm-form-item ${showStr}label="${it.desc}" prop="${it.name}">
        <gm-input v-model="editForm.${it.name}" type="textarea"${disabledStr} placeholder="请输入${it.desc}内容"></gm-input>
      </gm-form-item>`;
                    case ColumnsHTMLType.select:
                        return `
      <gm-form-item ${showStr}label="${it.desc}" prop="${it.name}">
        <gm-select v-model="editForm.${it.name}"${disabledStr} placeholder="请选择${it.desc}">
          <gm-option v-for="item in ${it.name}Options" :key="item.label" :label="item.label" :value="item.value" />
        </gm-select>
      </gm-form-item>`;
                    case ColumnsHTMLType.radio:
                        return `
      <gm-form-item ${showStr}label="${it.desc}" prop="${it.name}">
        <gm-radio-group v-model="editForm.${it.name}"${disabledStr}>
          <gm-radio v-for="it in ${it.name}Options" :key="it.label" :value="it.value">{{ it.label }}</gm-radio>
        </gm-radio-group>
      </gm-form-item>`;
                    case ColumnsHTMLType.checkbox:
                        return `
      <gm-form-item ${showStr}label="${it.desc}" prop="${it.name}">
        <gm-checkbox-group v-model="editForm.${it.name}"${disabledStr}>
          <gm-checkbox v-for="it in ${it.name}Options" :key="it.label" :value="it.value">{{ it.label }}</gm-checkbox>
        </gm-checkbox-group>
      </gm-form-item>`;
                    case ColumnsHTMLType.datetime:
                        return `
      <gm-form-item ${showStr}label="${it.desc}" prop="${it.name}">
        <gm-date-picker v-model="editForm.${it.name}" type="date" placeholder="请选择日期"${disabledStr}/>
      </gm-form-item>`;
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
        // 添加表单
        const addFormString = this.genFormStringFactory();
        let importOptionsString = this.entity.columns
            .filter(it => this.optionsTypes.includes(it.htmlType))
            .map(it => it.name + 'Options')
            .join(', ');
            if(importOptionsString){
              importOptionsString += ', '
            }
        return `<template>
  <div>
    <gm-form ref="editFormRef" :model="editForm" :rules="rules" label-width="auto">${addFormString}
    </gm-form>
  </div>
</template>
<script setup lang="ts">
import { use${TableName}Options } from '../composables/use${TableName}Options';
import type { FormInstance } from 'giime';
import type { Post${this.apiPrefix}AddInput } from '${this.dto.apiController}';

const editForm = defineModel<Post${this.apiPrefix}AddInput>('editForm', { required: true });
const editFormRef = ref<FormInstance>();

const { ${importOptionsString}rules } = use${TableName}Options();

const resetFields = () => {
  return editFormRef.value?.resetFields();
};
const validate = () => {
  return editFormRef.value?.validate();
};
defineExpose({
  resetFields,
  validate,
});
</script>
`;
    }
}
