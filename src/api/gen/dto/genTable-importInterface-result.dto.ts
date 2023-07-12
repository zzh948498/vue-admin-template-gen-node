import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class GenTableImportInterfaceResultDto {
    /**
     * name
     */
    @ApiProperty()
    name: string;
    /**
     * desc
     */
    @ApiProperty()
    desc: string;
    /**
     * tsType
     */
    @ApiProperty()
    tsType: string;
    /**
     * hasQuestionToken
     */
    @ApiProperty()
    hasQuestionToken: boolean;
}
