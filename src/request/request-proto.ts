import { IStringifyOptions } from "qs"
import { RequestPromiseOptions } from "request-promise-native"

const BASE_URL = "https://patreon.com"
const STRINGIFY_OPTIONS: IStringifyOptions = {
  arrayFormat: "comma",
  encode: false
}
const DEFAULT_REQUEST_OPTIONS: RequestPromiseOptions = {
  baseUrl: BASE_URL,
  headers: {
    Referer: `${BASE_URL}/home`
  },
  host: "www.patreon.com",
  json: true,
  qsStringifyOptions: STRINGIFY_OPTIONS,
  resolveWithFullResponse: true
}

export abstract class BasicAuthenticatedPatreonRequest {
  protected readonly sessionId: string
  private readonly requestBase: RequestPromiseOptions

  constructor(sessionId: string) {
    this.sessionId = sessionId
    this.requestBase = {
      ...DEFAULT_REQUEST_OPTIONS,
      headers: {
        ...DEFAULT_REQUEST_OPTIONS.headers,
        Cookie: `session_id=${this.sessionId}`
      }
    }
  }

  protected get getRequestOptions(): RequestPromiseOptions {
    return {
      ...this.requestBase,
      method: "GET"
    }
  }

  protected get postRequestOptions(): RequestPromiseOptions {
    return {
      ...this.requestBase,
      method: "POST"
    }
  }
}
