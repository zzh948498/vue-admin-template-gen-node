import { GenTableEntity } from '../entities/genTable.entity';

import { FeAiIndexMdTemp } from "./ai/index.md";
import { GenTableGenCodeDto } from '../dto/genTable-genCode.dto';
export class FeAiMdTemp {
    entity: GenTableEntity;

    constructor(entity: GenTableEntity, public dto: GenTableGenCodeDto) {
        this.entity = entity;
    }
    genZipOption() {
        return [
            {
                fileName: 'index.md',
                value: new FeAiIndexMdTemp(this.entity, this.dto).genString(),
            },
        ];
    }
}
