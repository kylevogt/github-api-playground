import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import { IMock, It, Mock, Times } from 'typemoq';
import { AppConfig } from './../app-config.model';
import { HttpService } from './../http/http.service';
import { Logger } from './../logger/logger.service';
import { GithubService } from './github.service';
import { getSampleOrgRepositoryListResponse, getSampleRepoPullRequestListResponse } from './test-data';

describe('GithubService', () => {
    let httpMock: IMock<HttpService>;
    let loggerMock: IMock<Logger>;
    let configMock: IMock<AppConfig>;
    let service: GithubService;

    beforeEach(() => {
        httpMock = Mock.ofType<HttpService>();
        configMock = Mock.ofType<AppConfig>();
        loggerMock = Mock.ofType<Logger>();

        service = new GithubService(httpMock.object, configMock.object, loggerMock.object);
    });

    describe('getOrganizationRepositories', () => {
        it('Sends request to correct url', async () => {
            httpMock
                .setup((http) => http.get('/orgs/org-name/repos', It.isAny()))
                .returns(() => Promise.resolve({
                    data: getSampleOrgRepositoryListResponse(),
                    headers: {},
                } as AxiosResponse))
                .verifiable(Times.once());

            await service.getOrganizationRepositories('org-name');

            httpMock.verifyAll();
        });

        it('Specifies correct baseurl', async () => {
            httpMock
                .setup((http) => http.get(It.isAny(), It.is((c) => c.baseURL === 'https://api.github.com')))
                .returns(() => Promise.resolve({ data: [], headers: {}} as AxiosResponse))
                .verifiable(Times.once());

            await service.getOrganizationRepositories('org-name');

            httpMock.verifyAll();
        });

        it('Specifies correct authorization header', async () => {
            configMock
                .setup((c) => c.githubAccessToken)
                .returns(() => 'supersecret');

            httpMock
                .setup((http) => http.get(It.isAny(), It.is((c) => c.headers.Authorization === 'token supersecret')))
                .returns(() => Promise.resolve({ data: [], headers: {}} as AxiosResponse))
                .verifiable(Times.once());

            await service.getOrganizationRepositories('org-name');

            httpMock.verifyAll();
        });

        it('Specifies api version', async () => {
            httpMock
                .setup((http) => http.get(
                    It.isAny(),
                    It.is((c) => c.headers.Accept === 'application/vnd.github.v3+json'),
                ))
                .returns(() => Promise.resolve({ data: [], headers: {}} as AxiosResponse))
                .verifiable(Times.once());

            await service.getOrganizationRepositories('org-name');

            httpMock.verifyAll();
        });

        it('Requests all pages', async () => {
            httpMock
                .setup((http) => http.get(
                    '/orgs/org-name/repos',
                    It.isAny(),
                ))
                .returns(() => Promise.resolve({
                    data: [{}, {}],
                    headers: {
                        link: '<https://api.github.com/orgs/24790523/repos?page=2>; rel="next"',
                    },
                } as AxiosResponse))
                .verifiable(Times.once());

            httpMock
                .setup((http) => http.get(
                    'https://api.github.com/orgs/24790523/repos?page=2',
                    It.isAny(),
                ))
                .returns(() => Promise.resolve({
                    data: [{}, {}],
                    headers: {
                        link: '<https://api.github.com/orgs/24790523/repos?page=3>; rel="next"',
                    },
                } as AxiosResponse))
                .verifiable(Times.once());

            httpMock
                .setup((http) => http.get(
                    'https://api.github.com/orgs/24790523/repos?page=3',
                    It.isAny(),
                ))
                .returns(() => Promise.resolve({
                    data: [{}],
                    headers: { },
                } as AxiosResponse))
                .verifiable(Times.once());

            const result = await service.getOrganizationRepositories('org-name');

            httpMock.verifyAll();
            httpMock.verify((http) => http.get(It.isAny(), It.isAny()), Times.exactly(3));
            expect(result.length).to.equal(5);
        });
    });

    describe('getRepositoryPullRequests', () => {
        it('Sends request to correct url', async () => {
            httpMock
                .setup((http) => http.get('/repos/org-name/repo-name/pulls?state=all', It.isAny()))
                .returns(
                    () => Promise.resolve({
                        data: getSampleRepoPullRequestListResponse(),
                        headers: {},
                    } as AxiosResponse),
                )
                .verifiable(Times.once());

            await service.getRepositoryPullRequests('org-name', 'repo-name');

            httpMock.verifyAll();
        });

        it('Specifies correct baseurl', async () => {
            httpMock
                .setup((http) => http.get(It.isAny(), It.is((c) => c.baseURL === 'https://api.github.com')))
                .returns(() => Promise.resolve({ data: [], headers: {}} as AxiosResponse))
                .verifiable(Times.once());

            await service.getRepositoryPullRequests('org-name', 'repo-name');

            httpMock.verifyAll();
        });

        it('Specifies api version', async () => {
            httpMock
                .setup((http) => http.get(
                    It.isAny(),
                    It.is((c) => c.headers.Accept === 'application/vnd.github.v3+json'),
                ))
                .returns(() => Promise.resolve({ data: [], headers: {}} as AxiosResponse))
                .verifiable(Times.once());

            await service.getRepositoryPullRequests('org-name', 'repo-name');

            httpMock.verifyAll();
        });

        it('Requests all pages', async () => {
            httpMock
                .setup((http) => http.get(
                    '/repos/org-name/repo-name/pulls?state=all',
                    It.isAny(),
                ))
                .returns(() => Promise.resolve({
                    data: [{}],
                    headers: {
                        link: '<https://api.github.com/repositories/24790523/pulls?state=all&page=2>; rel="next"',
                    },
                } as AxiosResponse))
                .verifiable(Times.once());

            httpMock
                .setup((http) => http.get(
                    'https://api.github.com/repositories/24790523/pulls?state=all&page=2',
                    It.isAny(),
                ))
                .returns(() => Promise.resolve({
                    data: [{}],
                    headers: {
                        link: '<https://api.github.com/repositories/24790523/pulls?state=all&page=3>; rel="next"',
                    },
                } as AxiosResponse))
                .verifiable(Times.once());

            httpMock
                .setup((http) => http.get(
                    'https://api.github.com/repositories/24790523/pulls?state=all&page=3',
                    It.isAny(),
                ))
                .returns(() => Promise.resolve({
                    data: [{}],
                    headers: { },
                } as AxiosResponse))
                .verifiable(Times.once());

            const result = await service.getRepositoryPullRequests('org-name', 'repo-name');

            httpMock.verifyAll();
            httpMock.verify((http) => http.get(It.isAny(), It.isAny()), Times.exactly(3));
            expect(result.length).to.equal(3);
        });
    });
});
