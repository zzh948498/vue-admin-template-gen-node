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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
