import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenColumnsController } from './genColumns.controller';
import { GenColumnsService } from './genColumns.service';
import { GenColumnsEntity } from './entities/genColumns.entity';
import { GenTableController } from "./genTable.controller";
import { GenTableService } from "./genTable.service";
import { GenTableEntity } from "./entities/genTable.entity";
import { GenTableRelationsController } from "./GenTableRelations.controller";
import { GenTableRelationsService } from "./GenTableRelations.service";
import { GenTableRelationsEntity } from "./entities/GenTableRelations.entity";

@Module({
    imports: [TypeOrmModule.forFeature([GenColumnsEntity, GenTableEntity, GenTableRelationsEntity])],
    controllers: [GenColumnsController, GenTableController, GenTableRelationsController],
    providers: [GenColumnsService, GenTableService, GenTableRelationsService],
    exports: [GenColumnsService, GenTableService, GenTableRelationsService],
})
export class GenModule {}
