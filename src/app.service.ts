import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppApifoxWhereDto } from './app.dto';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
    async apifox(dto: AppApifoxWhereDto) {
        const { data } = await axios
            .post(
                `https://api.apifox.com/api/v1/projects/${dto.projectId}/export-openapi`,

                {
                    version: '3.1',
                    excludeExtension: false,
                    excludeTagsWithFolder: false,
                    type: 1,
                    apiDetailId: [],
                    checkedFolder: [],
                    excludeTags: [],
                    includeTags: [],
                    selectedEnvironments: [],
                    openApiFormat: 'json',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Apifox-Version': '2024-01-20',
                        Authorization: `Bearer ${dto.access_token ?? ''}`,
                    },
                }
            )
            .catch(err => {
                // console.log(err?.response?.data);
                // console.log(err?.response?.data?.errorMessage);
                throw new BadRequestException(
                    err?.response?.data?.errorMessage ?? err?.response?.data ?? 'apifox链接获取失败 ！！！！'
                );
            });
        // console.log(data);
        return data;
    }
}
