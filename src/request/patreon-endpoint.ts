import { BasicAuthenticatedPatreonRequest } from './request-proto';
import * as request from 'request-promise-native';
import * as rqst from 'request';
import { OptionsWithUrl } from 'request-promise-native';
import { CurrentUserRequestOptions, StreamRequestOptions } from '../../types/request';
import { TypedResponse, StreamResponse, IFileUrlQS } from '../../types/response';

export class PatreonRequest extends BasicAuthenticatedPatreonRequest {
  protected async login(options?: any): Promise<TypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.postRequestOptions,
      url: '/api/login',
      qs: options
    };
    return request(requestOptions);
  }

  protected async getCurrentUser(options?: CurrentUserRequestOptions): Promise<request.FullResponse> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      url: '/api/current_user',
      qs: options
    };
    return request(requestOptions);
  }

  protected async getStream(options?: StreamRequestOptions): Promise<TypedResponse<StreamResponse>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      url: '/api/stream',
      qs: options
    };
    return request(requestOptions);
  }

  protected async getSimilar(options?: any): Promise<TypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      url: '/api/similar',
      qs: options
    };
    return request(requestOptions);
  }

  // should return 302 Found, redirect to real file
  protected getFile(identifier: IFileUrlQS): rqst.Request {
    const requestOptions: request.OptionsWithUrl = {
      ...this.getRequestOptions,
      url: '/file',
      qs: identifier,
      json: false
    };
    return rqst(requestOptions);
  }
}
