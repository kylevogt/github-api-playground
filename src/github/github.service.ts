import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { HttpService } from './../http/http.service';

@Service()
export class GithubService {
    private http: HttpService;

    constructor(http: HttpService) {
        this.http = http;
    }

    public async getOrganizationRepositories(organization: string): Promise<any> {
        const url: string = `/orgs/${organization}/repos`;
        const config: AxiosRequestConfig = this.getBaseConfig();

        try {
            const response: AxiosResponse<any> = await this.http.get(url, config);

            return response.data;
        } catch (error) {
            console.error('An error occured while requesting organization repositories', { organization, error });
        }
    }

    private getBaseConfig(): AxiosRequestConfig {
        return {
            baseURL: 'https://api.github.com',
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
        };
    }
}
