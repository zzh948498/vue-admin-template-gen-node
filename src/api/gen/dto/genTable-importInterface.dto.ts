import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class GenTableImportInterfaceDto {
    /**
     * interface
     */
    @ApiProperty()
    @IsString()
    interface: string;
}
