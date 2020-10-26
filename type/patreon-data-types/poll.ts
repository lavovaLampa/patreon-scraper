import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties,
  CommonRelationships,
  DataIdentifier,
  GenericRelationshipAttributes
} from "../response"

export interface Poll extends CommonDataProperties {
  attributes: PollAttributes
  relationships: PollRelationships
  type: DataTypeKey.Poll
}

interface PollAttributes extends CommonAttributes {
  closes_at: Date | null
  created_at: Date
  num_responses: number
  question_text: string
  question_type: IPollQuestionTypeKey
}

enum IPollQuestionTypeKey {
  MultipleChoice = "multiple_choice"
}

interface PollRelationships extends CommonRelationships {
  choices?: GenericRelationshipAttributes<DataIdentifier[], void>
  current_user_responses?: GenericRelationshipAttributes<any[], void>
}
