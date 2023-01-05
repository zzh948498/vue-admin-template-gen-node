import { IsString } from "class-validator";
import { Column } from "typeorm";

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