import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { ColumnsType } from '../entities/genColumns.entity';

export class GenAIGetTemplateResultDto {
    /**
     * name
     */
    @ApiProperty()
    fileName: string;
    /**
     * desc
     */
    @ApiProperty()
    tempContent: string;
}
export class GenAIGetTemplateQueryDto {
    /**
     * path
     */
    @ApiProperty()
    path?: string;

}
