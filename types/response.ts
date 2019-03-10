import { FullResponse } from "request-promise-native";
import { ICommonLinks, TDataObject } from "./common";

export interface ITypedResponse<T> extends FullResponse {
  body: T;
}

export interface IGenericResponse<T, U> {
  data: T;
  included: TDataObject[];
  links: ICommonLinks;
  meta: U;
}
