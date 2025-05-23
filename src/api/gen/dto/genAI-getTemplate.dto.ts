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
    /**
     * 文件基础路径
     */
    @ApiProperty()
    fileBasePath?: string;
}
export class GenAIGetTemplateQueryDto {
    /**
     * path
     */
    @ApiProperty()
    path?: string;
}
