import {
  DataTypeKey, ICommonAttributes, ICommonDataProperties,
  ICommonRelationshipAttributes, ICommonRelationships,
} from "../common";

export interface IUser extends ICommonDataProperties {
  attributes: IUserAttributes;
  relationships: IUserRelationships;
  type: DataTypeKey.User;
}

interface IUserAttributes extends ICommonAttributes {
  full_name: string;
  image_url: string;
  social_connections: ISocialConnections;
  url: string;
}

interface IUserRelationships extends ICommonRelationships {
  campaign?: ICommonRelationshipAttributes;
}

interface ISocialConnections {
  deviantart: any | null;
  discord: any | null;
  facebook: any | null;
  instagram: any | null;
  reddit: any | null;
  spotify: any | null;
  twitch: any | null;
  twitter: any | null;
  youtube: any | null;
}
