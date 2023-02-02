import { GenTableEntity } from '../entities/genTable.entity';

export abstract class FeTempsFactory {
    constructor(protected entity: GenTableEntity) {}

    public abstract genString(): string;
}
