import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenColumnsController } from './genColumns.controller';
import { GenColumnsService } from './genColumns.service';
import { GenColumnsEntity } from './entities/genColumns.entity';
import { GenTableController } from "./genTable.controller";
import { GenTableService } from "./genTable.service";
import { GenTableEntity } from "./entities/genTable.entity";

@Module({
    imports: [TypeOrmModule.forFeature([GenColumnsEntity, GenTableEntity])],
    controllers: [GenColumnsController, GenTableController],
    providers: [GenColumnsService, GenTableService],
    exports: [GenColumnsService, GenTableService],
})
export class GenModule {}
