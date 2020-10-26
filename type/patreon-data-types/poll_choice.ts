import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties
} from "../response"

export interface IPollChoice extends CommonDataProperties {
  attributes: IPollChoiceAttributes
  type: DataTypeKey.PollChoice
}

interface IPollChoiceAttributes extends CommonAttributes {
  choice_type: ChoiceTypeTypeKey
  num_responses: number
  position: number
  text_content: string
}

enum ChoiceTypeTypeKey {
  Toggle = "toggle"
}
