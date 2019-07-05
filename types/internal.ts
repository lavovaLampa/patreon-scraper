export interface IAttachmentIdentifier extends IFileUrlQS {
  name: string;
}

export interface IFileUrlQS {
  h: string;
  i: string;
}

export type Maybe<T> = T | null;

export interface IOptionDefinition<T> {
  func: (val: T) => Promise<void>;
  isParsed: boolean;
  longOpt: string;
  shortOpt?: string;
}
