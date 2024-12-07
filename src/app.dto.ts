import { IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class AppReadJsonWhereDto {
    /**
     * 表名称
     */
    @IsString()
    url: string;
}
export class AppReadJsonRes {
    @Column()
    json: any;
}

export class AppApifoxWhereDto {
    /**
     * projectId
     */
    @IsString()
    projectId: string;

    /**
     * access_token
     */
    @IsOptional()
    access_token?: string;
}
