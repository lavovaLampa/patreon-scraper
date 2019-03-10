import { DataTypeKey, ICommonAttributes, ICommonDataProperties } from "../common";

export interface ICampaign extends ICommonDataProperties {
  attributes: ICampaignAttributes;
  type: DataTypeKey.Campaign;
}

interface ICampaignAttributes extends ICommonAttributes {
  summary?: string;
  avatar_photo_url?: string;
  earnings_visibility: EarningsVisibilityTypeKey;
  is_monthly: boolean;
  is_nsfw: boolean;
  name: string;
  url: string;
}

enum EarningsVisibilityTypeKey {
  Public = "public",
}
