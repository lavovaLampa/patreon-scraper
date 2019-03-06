import { IStringifyOptions } from 'qs';
import { CookieJar, Cookie } from 'tough-cookie';
import { RequestPromiseOptions } from 'request-promise-native';

const BASE_URL = 'https://patreon.com';
const STRINGIFY_OPTIONS: IStringifyOptions = {
  encode: false,
  arrayFormat: 'comma'
};
const DEFAULT_REQUEST_OPTIONS: RequestPromiseOptions = {
  baseUrl: BASE_URL,
  host: 'www.patreon.com',
  json: true,
  resolveWithFullResponse: true,
  qsStringifyOptions: STRINGIFY_OPTIONS,
  headers: {
    'Referer': 'https://patreon.com/home'
  }
};

export abstract class BasicAuthenticatedPatreonRequest {
  protected readonly sessionId: string;
  protected readonly cookieJar: CookieJar;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.cookieJar = new CookieJar();
    const cookie = new Cookie({
      key: 'session_id',
      value: `${sessionId}`,
      httpOnly: true,
      secure: true,
      path: '/'
    });
    try {
      this.cookieJar.setCookieSync(cookie, BASE_URL);
    } catch (e) {
      console.error(e);
    }
  }

  protected get getRequestOptions(): RequestPromiseOptions {
    const tempObj = DEFAULT_REQUEST_OPTIONS;
    tempObj.method = 'GET';
    tempObj.headers = {
      'Cookie': this.cookieJar.getCookieStringSync(BASE_URL),
      ...tempObj.headers
    };
    return tempObj;
  }

  protected get postRequestOptions(): RequestPromiseOptions {
    const tempObj = DEFAULT_REQUEST_OPTIONS;
    tempObj.method = 'POST';
    tempObj.headers = {
      'Cookie': this.cookieJar.getCookieStringSync(BASE_URL),
      ...tempObj.headers
    };
    return tempObj;
  }
}
