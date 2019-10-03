import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as parseLinkHeader from 'parse-link-header';
import { Links } from 'parse-link-header';
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
        const url: string = `/repos/${owner}/${repositoryName}/pulls?state=all`;
        const config: AxiosRequestConfig = this.getBaseConfig();

        return await this.requestPullRequests(url, config);
    }

    private async requestPullRequests(url: string, config: AxiosRequestConfig): Promise<PullRequest[]> {
        try {
            console.log('Requesting pull requests', url);
            const response: AxiosResponse<PullRequest[]> = await this.http.get(url, config);

            const links: Links | null = parseLinkHeader(response.headers.link);

            if (links && links.next) {
                console.log('There is another page', links.next.url);
                return [
                    ...response.data,
                    ...await this.requestPullRequests(links.next.url, config),
                ];
            } else {
                return response.data;
            }

        } catch (error) {
            console.error(
                'An error occured while requesting repository pull requests',
                { url, error },
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
