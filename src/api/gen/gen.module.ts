import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenColumnsController } from './genColumns.controller';
import { GenColumnsService } from './genColumns.service';
import { GenColumnsEntity } from './entities/genColumns.entity';
import { GenTableController } from './genTable.controller';
import { GenTableService } from './genTable.service';
import { GenTableEntity } from './entities/genTable.entity';

import { GenTableRelationsEntity } from './entities/genTableRelations.entity';
import { GenTableRelationsController } from './genTableRelations.controller';
import { GenTableRelationsService } from './genTableRelations.service';

/**AI编程 */
import { GenAIController } from './genAI.controller';
import { GenAIService } from './genAI.service';

@Module({
    imports: [TypeOrmModule.forFeature([GenColumnsEntity, GenTableEntity, GenTableRelationsEntity])],
    controllers: [GenColumnsController, GenTableController, GenTableRelationsController, GenAIController],
    providers: [GenColumnsService, GenTableService, GenTableRelationsService, GenAIService],
    exports: [GenColumnsService, GenTableService, GenTableRelationsService, GenAIService],
})
export class GenModule {}
