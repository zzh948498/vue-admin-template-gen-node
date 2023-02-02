import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database, Resource } from '@adminjs/typeorm';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { validate } from 'class-validator';
import { createAdminOption } from '@common/admin/adminOption';
import { GenModule } from '@api/gen/gen.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@common/filters/httpException.filter';
import { DictModule } from '@api/dict/dict.module';

Resource.validate = validate;
AdminJS.registerAdapter({ Database, Resource });
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '10.11.2.164',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'zzh',
            autoLoadEntities: true,
            // entities: [],
            synchronize: true,
        }),
        AdminModule.createAdminAsync(createAdminOption()),
        ConfigModule.forRoot(),
        GenModule,
        DictModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
