import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties,
  CommonRelationships
} from "../response"

export interface ICampaign extends CommonDataProperties {
  attributes: ICampaignAttributes
  relationships: ICampaignRelationships
  type: DataTypeKey.Campaign
}

interface ICampaignAttributes extends CommonAttributes {
  avatar_photo_url?: string
  created_at: Date
  creation_count: number
  creation_name: string | null
  discord_server_id?: string | null
  earnings_visibility: EarningsVisibilityTypeKey
  google_analytics_id?: string | null
  has_rss?: boolean
  has_sent_rss_notify?: boolean
  image_small_url: string
  image_url: string
  is_charged_immediately?: boolean | null
  is_monthly: boolean
  is_nsfw: boolean
  main_video_embed: string | null
  main_video_url: string | null
  name: string
  one_liner: string | null
  outstanding_payment_amount_cents: number
  patron_count: number
  pay_per_name: string | null
  pledge_sum: number
  pledge_url: string
  published_at: Date | null
  rss_artwork_url?: string | null
  rss_feed_title?: string
  summary?: string | null
  thanks_embed: string | null
  thanks_msg: string | null
  thanks_video_url: string | null
  url: string
}

interface ICampaignRelationships extends CommonRelationships {
  creator?: any
  goals?: any
  pledges?: any
  rewards?: any
}

enum EarningsVisibilityTypeKey {
  Patrons = "patrons_only",
  Private = "private",
  Public = "public"
}
