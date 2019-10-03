import { Service } from 'typedi';
import { GithubService } from './github/github.service';
import { PullRequest } from './github/models/pull-request.model';
import { Repository } from './github/models/repository.model';
import { Logger } from './logger/logger.service';

@Service()
export class OrganizationPrAnalyzerService {
    private github: GithubService;
    private logger: Logger;

    constructor(github: GithubService, logger: Logger) {
        this.github = github;
        this.logger = logger;
    }

    public async loadOrganizationPullRequests(organization: string): Promise<PullRequest[]> {
        this.logger.info(`Pulling repository list for ${organization}...`);
        const repositories: Repository[] = await this.github.getOrganizationRepositories(organization);

        this.logger.info('Found these repositories: ', repositories.map((r) => r.full_name));

        this.logger.info('Building list of pull requests...');
        const requests: Promise<PullRequest[]>[] = repositories
            .map((repo: Repository) => this.loadPullRequestsForRepository(organization, repo));

        const pullRequests: PullRequest[] = (await Promise.all(requests))
            .reduce((previous: PullRequest[], current: PullRequest[]) => [...previous, ...current], []);

        return pullRequests;
    }

    private async loadPullRequestsForRepository(organization: string, repository: Repository): Promise<PullRequest[]> {
        this.logger.info(`Sending request(s) for pull requests from ${repository.full_name}`);

        const pullRequests: PullRequest[] = await this.github.getRepositoryPullRequests(organization, repository.name);

        this.logger.info(`Found ${pullRequests.length} PR's for the repository ${repository.full_name}`);

        return pullRequests;
    }
}
