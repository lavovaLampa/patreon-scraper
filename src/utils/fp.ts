import { Maybe } from "../../types/internal";

export function doIfSome<P, R>(defaultVal: R, ifSome: (val: P) => R): (val: Maybe<P>) => R {
  return (val: Maybe<P>) => {
    if (val !== null) {
      return ifSome(val);
    } else {
      return defaultVal;
    }
  };
}

export function foldMaybe<T, R>(defaultVal: T, func: (val: T) => R): (maybeVal: Maybe<T>) => R {
  return (maybeVal) => {
    const val = maybeVal !== null ? maybeVal : defaultVal;
    return func(val);
  };
}
