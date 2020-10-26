import hooman from "hooman"
// import got from "got"
import { CancelableRequest, Response } from "got"
import Request from "got/dist/source/core"
import { CookieJar } from "tough-cookie"
import { URLSearchParams } from "url"
import { Maybe } from "../../type/common"

const BASE_URL = "https://patreon.com"

export abstract class BasicAuthenticatedPatreonRequest {
  protected readonly sessionId: string
  protected readonly requestBase: {
    prefixUrl: string
    cookieJar: CookieJar
  }
  protected cookieJar: CookieJar

  constructor(sessionId: string) {
    this.cookieJar = new CookieJar()
    this.cookieJar.setCookieSync(`session_id=${sessionId}`, BASE_URL)

    this.sessionId = sessionId
    this.requestBase = {
      prefixUrl: BASE_URL,
      cookieJar: this.cookieJar
    }
  }

  protected getJsonRequest<T>(
    url: string,
    searchParams?: Maybe<URLSearchParams>
  ): CancelableRequest<Response<T>> {
    /// @ts-ignore
    return hooman<T>(url, {
      ...this.requestBase,
      method: "GET",
      responseType: "json",
      searchParams: searchParams ?? undefined
    })
  }

  protected getStreamRequest(url: string): Request {
    return hooman(url, {
      isStream: true,
      method: "GET"
    })
  }

  protected postRequest<T>(url: string): CancelableRequest<Response<T>> {
    /// @ts-ignore
    return hooman<T>(url, {
      ...this.requestBase,
      method: "POST"
    })
  }
}
