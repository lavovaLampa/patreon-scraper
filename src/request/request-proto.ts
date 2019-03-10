import { AssertionError } from "assert";
import { IStringifyOptions } from "qs";
import { RequestPromiseOptions } from "request-promise-native";
import { Cookie, CookieJar } from "tough-cookie";

const BASE_URL = "https://patreon.com";
const STRINGIFY_OPTIONS: IStringifyOptions = {
  arrayFormat: "comma",
  encode: false,
};
const DEFAULT_REQUEST_OPTIONS: RequestPromiseOptions = {
  baseUrl: BASE_URL,
  headers: {
    Referer: "https://patreon.com/home",
  },
  host: "www.patreon.com",
  json: true,
  qsStringifyOptions: STRINGIFY_OPTIONS,
  resolveWithFullResponse: true,
};

export abstract class BasicAuthenticatedPatreonRequest {
  protected readonly cookieJar: CookieJar;
  protected readonly sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.cookieJar = new CookieJar();
    const cookie = new Cookie({
      httpOnly: true,
      key: "session_id",
      path: "/",
      secure: true,
      value: `${sessionId}`,
    });
    try {
      this.cookieJar.setCookieSync(cookie, BASE_URL);
    } catch (e) {
      console.error(e);
      throw new AssertionError({ message: "failed to add cookie to cookie jar" });
    }
  }

  protected get getRequestOptions(): RequestPromiseOptions {
    const tempObj = DEFAULT_REQUEST_OPTIONS;
    tempObj.method = "GET";
    tempObj.headers = {
      Cookie: this.cookieJar.getCookieStringSync(BASE_URL),
      ...tempObj.headers,
    };
    return tempObj;
  }

  protected get postRequestOptions(): RequestPromiseOptions {
    const tempObj = DEFAULT_REQUEST_OPTIONS;
    tempObj.method = "POST";
    tempObj.headers = {
      Cookie: this.cookieJar.getCookieStringSync(BASE_URL),
      ...tempObj.headers,
    };
    return tempObj;
  }
}
