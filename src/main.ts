import 'reflect-metadata';
import Container from 'typedi';
import { PullRequest } from './github/models/pull-request.model';
import { OrganizationPrAnalyzerService } from './organization-pr-analyzer.service';

execute()
    .then(() => console.log('Process has completed'))
    .catch((error) => console.error('Process has encountered an uncaught error', error));

async function execute(): Promise<void> {
    const organization: string = 'ramda';
    const analyzer: OrganizationPrAnalyzerService = Container.get(OrganizationPrAnalyzerService);
    const pullRequests: PullRequest[] = await analyzer.loadOrganizationPullRequests(organization);

    console.log(`Found ${pullRequests.length} PR's for organization ${organization}`);
}
