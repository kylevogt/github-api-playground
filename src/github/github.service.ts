import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { HttpService } from './../http/http.service';
import { PullRequest } from './models/pull-request.model';
import { Repository } from './models/repository.model';

@Service()
export class GithubService {
    private http: HttpService;

    constructor(http: HttpService) {
        this.http = http;
    }

    public async getOrganizationRepositories(organization: string): Promise<Repository[]> {
        const url: string = `/orgs/${organization}/repos`;
        const config: AxiosRequestConfig = this.getBaseConfig();

        try {
            const response: AxiosResponse<Repository[]> = await this.http.get(url, config);

            return response.data;
        } catch (error) {
            console.error('An error occured while requesting organization repositories', { organization, error });

            throw error;
        }
    }

    public async getRepositoryPullRequests(owner: string, repositoryName: string): Promise<PullRequest[]> {
        const url: string = `/repos/${owner}/${repositoryName}/pulls`;
        const config: AxiosRequestConfig = this.getBaseConfig();

        try {
            const response: AxiosResponse<PullRequest[]> = await this.http.get(url, config);

            return response.data;
        } catch (error) {
            console.error(
                'An error occured while requesting repository pull requests',
                { owner, repositoryName, error },
            );

            throw error;
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
