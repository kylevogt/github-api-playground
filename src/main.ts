import 'reflect-metadata';
import Container from 'typedi';
import { GithubService } from './github/github.service';
import { Repository } from './github/models/repository.model';

execute()
    .then(() => console.log('Process has completed'))
    .catch((error) => console.error('Process has encountered an uncaught error', error));

async function execute(): Promise<void> {
    const github: GithubService = Container.get(GithubService);

    const results: Repository[] = await github.getOrganizationRepositories('ramda');

    console.log('Got these results', results.map((r) => r.full_name));
}
