import { parseSwaggerPathTemplateToFnName } from '@zeronejs/cli/src/utils/generateUtil';
import { ColumnsHTMLType } from '../entities/genColumns.entity';
import { GenTableEntity } from '../entities/genTable.entity';
import { camelCase, upperFirst } from 'lodash';

export abstract class FeTempsFactory {
    constructor(protected entity: GenTableEntity) {}

    optionsTypes = [ColumnsHTMLType.radio, ColumnsHTMLType.checkbox, ColumnsHTMLType.select];
    apiPrefix = upperFirst(camelCase(parseSwaggerPathTemplateToFnName(this.entity.pathPrefix)));

    public abstract genString(): string;
}
