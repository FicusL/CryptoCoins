import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { injectable } from 'inversify';

@injectable()
export class AxiosWrapper {
  private readonly BASE_PATH = '/api';

  private readonly client = axios.create({
    baseURL: `${window.location.origin + this.BASE_PATH}`,
  });

  constructor() {
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  // noinspection JSMethodCanBeStatic
  protected onSuccess(response: AxiosResponse) {
    const { url, baseURL } = response.config;
    const path = `${this.BASE_PATH}${(url || '').slice((baseURL || '').length)}`;

    console.debug(`Request Successful! (${path})`, response); // tslint:disable-line
    return response.data;
  }

  // noinspection JSMethodCanBeStatic
  protected onError(error: AxiosError): Promise<AxiosResponse | string>  {
    const { url, baseURL } = error.config;
    const path = `${this.BASE_PATH}${(url || '').slice((baseURL || '').length)}`;

    console.error(`Request Failed (${path}):`, error.config); // tslint:disable-line

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error('Status:',  error.response.status); // tslint:disable-line
      console.error('Data:',    error.response.data); // tslint:disable-line
      console.error('Headers:', error.response.headers); // tslint:disable-line
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message); // tslint:disable-line
    }

    return Promise.reject(error.response || error.message);
  }

  async request(options: AxiosRequestConfig) {
    return this.client(options)
      .then(this.onSuccess)
      .catch(this.onError);
  }

  public async get<ResponseType = any>(path: string, options?: AxiosRequestConfig): Promise<ResponseType> {
    return this.request({ method: 'GET', url: path, ...options });
  }

  public async post<PayloadType = any, ResponseType = any>(path: string, payload?: PayloadType, options?: AxiosRequestConfig):
    Promise<ResponseType>
  {
    return this.request({ method: 'POST', url: path, data: payload, ...options });
  }

  public async put<PayloadType = any, ResponseType = any>(path: string, payload?: PayloadType, options?: AxiosRequestConfig):
    Promise<ResponseType>
  {
    return this.request({ method: 'PUT', url: path, data: payload, ...options });
  }

  public async delete<ResponseType = any, PayloadType = any>(path: string, payload?: PayloadType, options?: AxiosRequestConfig):
    Promise<ResponseType>
  {
    return this.request({ method: 'DELETE', url: path, data: payload, ...options });
  }
}