import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as parseLinkHeader from 'parse-link-header';
import { Links } from 'parse-link-header';
import { Service } from 'typedi';
import { HttpService } from './../http/http.service';
import { Logger } from './../logger/logger.service';
import { PullRequest } from './models/pull-request.model';
import { Repository } from './models/repository.model';

@Service()
export class GithubService {
    private http: HttpService;
    private logger: Logger;

    constructor(http: HttpService, logger: Logger) {
        this.http = http;
        this.logger = logger;
    }

    public async getOrganizationRepositories(organization: string): Promise<Repository[]> {
        const url: string = `/orgs/${organization}/repos`;
        const config: AxiosRequestConfig = this.getBaseConfig();

        try {
            return await this.requestAllPages<Repository>(url, config);
        } catch (error) {
            this.logger.error('An error occured while requesting organization repositories', { organization, error });

            throw error;
        }
    }

    public async getRepositoryPullRequests(owner: string, repositoryName: string): Promise<PullRequest[]> {
        const url: string = `/repos/${owner}/${repositoryName}/pulls?state=all`;
        const config: AxiosRequestConfig = this.getBaseConfig();

        try {
            return await this.requestAllPages<PullRequest>(url, config);
        } catch (error) {
            this.logger.error(
                'An error occured while requesting repository pull requests',
                { url, error },
            );

            throw error;
        }
    }

    private async requestAllPages<T>(url: string, config: AxiosRequestConfig): Promise<T[]> {
        this.logger.info('Requesting page...', url);
        const response: AxiosResponse<T[]> = await this.http.get(url, config);
        const links: Links | null = parseLinkHeader(response.headers.link);

        if (links && links.next) {
            this.logger.info('There is another page', links.next.url);
            return [
                ...response.data,
                ...await this.requestAllPages<T>(links.next.url, config),
            ];
        } else {
            return response.data;
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
