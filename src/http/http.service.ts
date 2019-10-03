import * as axios from 'axios';
import { Service } from 'typedi';

@Service()
export class HttpService {
    public get<T>(url: string, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse<T>> {
        return axios.default.get(url, config);
    }
}
