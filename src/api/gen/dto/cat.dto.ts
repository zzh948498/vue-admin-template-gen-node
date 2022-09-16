import { ApiProperty } from "@nestjs/swagger";

export class CatDto {
    /**
     * a
     */
    name: string;

    age: number;

    breed: string;
}