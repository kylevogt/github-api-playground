import 'reflect-metadata';
import Container from 'typedi';
import { GithubService } from './github/github.service';
import { PullRequest } from './github/models/pull-request.model';
import { Repository } from './github/models/repository.model';

execute()
    .then(() => console.log('Process has completed'))
    .catch((error) => console.error('Process has encountered an uncaught error', error));

async function execute(): Promise<void> {
    const github: GithubService = Container.get(GithubService);
    const owner: string = 'ramda';

    console.log(`Pulling repository list for ${owner}...`);
    const repositories: Repository[] = await github.getOrganizationRepositories(owner);

    console.log('Found these repositories: ', repositories.map((r) => r.full_name));
    console.log('Building list of pull requests...');

    const requests: Promise<PullRequest[]>[] = repositories
        .map((repo: Repository) => github.getRepositoryPullRequests(owner, repo.name));

    const pullRequests: PullRequest[] = (await Promise.all(requests))
        .reduce((previous: PullRequest[], current: PullRequest[]) => [...previous, ...current], []);

    console.log(`Found ${pullRequests.length} PR's for organization ${owner}`);
}
