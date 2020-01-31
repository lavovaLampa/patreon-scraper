import { IStringifyOptions } from "qs"
import { RequestPromiseOptions } from "request-promise-native"
import { RequestPromise } from "request-promise"
import { Response, OptionsWithUrl } from "cloudscraper"
import * as cloudscraper from "cloudscraper"

const BASE_URL = "https://patreon.com"
const STRINGIFY_OPTIONS: IStringifyOptions = {
  arrayFormat: "comma",
  encode: false
}

export abstract class BasicAuthenticatedPatreonRequest {
  protected readonly sessionId: string
  protected readonly requestBase: RequestPromiseOptions

  constructor(sessionId: string) {
    this.sessionId = sessionId
    this.requestBase = {
      baseUrl: BASE_URL,
      resolveWithFullResponse: true,
      qsStringifyOptions: STRINGIFY_OPTIONS,
      json: true
    }
  }

  protected getRequest(url: string, options?: any): RequestPromise<Response> {
    return this.cloudscraperRequest("GET", url, options)
  }

  protected postRequest(url: string, options?: any): RequestPromise<Response> {
    return this.cloudscraperRequest("POST", url, options)
  }

  private cloudscraperRequest(
    method: "GET" | "POST",
    url: string,
    options?: any
  ): RequestPromise<Response> {
    cloudscraper.defaultParams.headers = {
      ...cloudscraper.defaultParams.headers,
      Cookie: `session_id=${this.sessionId}`
    }
    const requestOptions: OptionsWithUrl = {
      ...this.requestBase,
      method,
      url,
      qs: options
    }
    return cloudscraper(requestOptions)
  }
}
