import { Service } from 'typedi';
import { GithubService } from './github/github.service';
import { PullRequest } from './github/models/pull-request.model';
import { Repository } from './github/models/repository.model';

@Service()
export class OrganizationPrAnalyzerService {
    private github: GithubService;

    constructor(github: GithubService) {
        this.github = github;
    }

    public async loadOrganizationPullRequests(organization: string): Promise<PullRequest[]> {
        console.log(`Pulling repository list for ${organization}...`);
        const repositories: Repository[] = await this.github.getOrganizationRepositories(organization);

        console.log('Found these repositories: ', repositories.map((r) => r.full_name));

        console.log('Building list of pull requests...');
        const requests: Promise<PullRequest[]>[] = repositories
            .map((repo: Repository) => this.loadPullRequestsForRepository(organization, repo));

        const pullRequests: PullRequest[] = (await Promise.all(requests))
            .reduce((previous: PullRequest[], current: PullRequest[]) => [...previous, ...current], []);

        return pullRequests;
    }

    private async loadPullRequestsForRepository(organization: string, repository: Repository): Promise<PullRequest[]> {
        console.log(`Sending request for pull requests from ${repository.full_name}`);

        const pullRequests: PullRequest[] = await this.github.getRepositoryPullRequests(organization, repository.name);

        console.log(`Found ${pullRequests.length} PR's for the repository ${repository.full_name}`);

        return pullRequests;
    }
}
