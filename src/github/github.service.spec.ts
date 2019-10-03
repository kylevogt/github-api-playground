import { AxiosStatic } from 'axios';
import { IMock, Mock } from 'typemoq';
import { HttpService } from './../http/http.service';
import { GithubService } from './github.service';

describe('Github', () => {
    let axiosMock: IMock<HttpService>;
    let service: GithubService;

    beforeEach(() => {
        axiosMock = Mock.ofType<AxiosStatic>();

        service = new GithubService(axiosMock.object);
    });
    it('runs');
});
