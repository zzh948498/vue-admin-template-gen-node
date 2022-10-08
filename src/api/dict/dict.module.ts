import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictController } from './dict.controller';
import { DictService } from './dict.service';
import { DictEntity } from './entities/dict.entity';
import { DictDataController } from "./dictData.controller";
import { DictDataService } from "./dictData.service";
import { DictDataEntity } from "./entities/dictData.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DictEntity, DictDataEntity])],
    controllers: [DictController, DictDataController],
    providers: [DictService, DictDataService],
    exports: [DictService, DictDataService],
})
export class DictModule {}
