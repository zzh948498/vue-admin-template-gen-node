import { ColumnsHTMLType, ColumnsType, GenColumnsEntity } from '../../../entities/genColumns.entity';
import { GenTableEntity } from '../../../entities/genTable.entity';
import { upperFirst, lowerFirst } from 'lodash';
import { FeTempsFactory } from '../../feTempsFactory';
import { randomUUID } from 'crypto';
import { isNil } from '@zeronejs/utils';
import { GenTableGenCodeDto } from '@api/gen/dto/genTable-genCode.dto';
export class FeGiimeUseOptionsTemp extends FeTempsFactory {
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
     * 生成下拉单选的数据组
     */
    genOptionsString() {
        const list = this.entity.columns.filter(it => this.optionsTypes.includes(it.htmlType));
        return `${list
            .map(it => {
                if (it.tsType === ColumnsType.boolean) {
                    return `
  const ${it.name}Options = [
    { label: '是', value: true },
    { label: '否', value: false },
  ];`;
                }
                if (isNil(it.enumValues) || it.enumValues?.length === 0) {
                    it.enumValues = ['', ''];
                }
                return `
  const ${it.name}Options = [${it.enumValues
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
        // 表名
        const tableName = lowerFirst(this.entity.name.replace(/Entity$/, ''));
        const TableName = upperFirst(tableName);
        const queryList = this.queryList;
        const requiredList = this.requiredList;
        const optionsString = this.genOptionsString();
        const importOptionsString = this.entity.columns
            .filter(it => this.optionsTypes.includes(it.htmlType))
            .map(it => it.name + 'Options,').join(`
    `);
        return `export const use${TableName}Options = () => {${optionsString}
  const rules = {${requiredList
      .map(
          it => `
    ${it.name}: [{ required: true, message: '${it.desc}不能为空', trigger: 'blur' }],`
      )
      .join('')}
  };
  return {
    rules,
    ${importOptionsString}
  };
};
`;
    }
}
