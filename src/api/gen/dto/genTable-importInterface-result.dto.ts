import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { ColumnsType } from '../entities/genColumns.entity';

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
    tsType: ColumnsType;
    /**
     * hasQuestionToken
     */
    @ApiProperty()
    hasQuestionToken: boolean;
}
