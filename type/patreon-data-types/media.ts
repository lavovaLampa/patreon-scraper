import {
  CommonAttributes,
  CommonDataProperties,
  DataTypeKey
} from "../response"

export interface Media extends CommonDataProperties {
  attributes: MediaAttributes
  type: DataTypeKey.Media
}

interface MediaAttributes extends CommonAttributes {
  download_url: string
  file_name: string
  image_urls?: any
  metadata: MediaMetadata
}

interface MediaMetadata {
  dimensions: Dimensions
}

interface Dimensions {
  h: number
  w: number
}
