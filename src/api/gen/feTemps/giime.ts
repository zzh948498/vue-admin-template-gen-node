import { upperFirst } from 'lodash';
import { GenTableEntity } from '../entities/genTable.entity';

import { FeGiimeEditDialogTemp } from './giime/components/EditDialog.vue';
import { FeGiimeEditFormTemp } from './giime/components/EditForm.vue';
import { FeGiimeSearchTemp } from './giime/components/Search.vue';
import { FeGiimeTableTemp } from './giime/components/Table.vue';
import { FeGiimeTableToolbarTemp } from './giime/components/TableToolbar.vue';
import { FeGiimeUseOptionsTemp } from './giime/composables/useOptions';
import { FeGiimeIndexTemp } from './giime/index.vue';
import { GenTableGenCodeDto } from '../dto/genTable-genCode.dto';
export class FeGiimeTemp {
    entity: GenTableEntity;

    constructor(entity: GenTableEntity, public dto: GenTableGenCodeDto) {
        this.entity = entity;
    }
    genZipOption() {
        return [
            {
                fileName: 'components/EditDialog.vue',
                value: new FeGiimeEditDialogTemp(this.entity, this.dto).genString(),
            },
            {
                fileName: 'components/EditForm.vue',
                value: new FeGiimeEditFormTemp(this.entity, this.dto).genString(),
            },
            {
                fileName: 'components/Search.vue',
                value: new FeGiimeSearchTemp(this.entity, this.dto).genString(),
            },
            {
                fileName: 'components/Table.vue',
                value: new FeGiimeTableTemp(this.entity, this.dto).genString(),
            },
            {
                fileName: 'components/TableToolbar.vue',
                value: new FeGiimeTableToolbarTemp(this.entity, this.dto).genString(),
            },
            {
                fileName: `composables/use${upperFirst(this.entity.name)}Options.ts`,
                value: new FeGiimeUseOptionsTemp(this.entity, this.dto).genString(),
            },
            {
                fileName: 'index.vue',
                value: new FeGiimeIndexTemp(this.entity, this.dto).genString(),
            },
        ];
    }
}
