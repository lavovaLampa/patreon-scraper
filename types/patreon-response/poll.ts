import {
  DataTypeKey, ICommonAttributes, ICommonDataProperties,
  ICommonRelationships, IDataIdentifier, IGenericRelationshipAttributes,
} from "../common";

export interface IPoll extends ICommonDataProperties {
  attributes: IPollAttributes;
  relationships: IPollRelationships;
  type: DataTypeKey.Poll;
}

interface IPollAttributes extends ICommonAttributes {
  closes_at: Date | null;
  created_at: Date;
  num_responses: number;
  question_text: string;
  question_type: IPollQuestionTypeKey;
}

enum IPollQuestionTypeKey {
  MultipleChoice = "multiple_choice",
}

interface IPollRelationships extends ICommonRelationships {
  choices?: IGenericRelationshipAttributes<IDataIdentifier[], void>;
  current_user_responses?: IGenericRelationshipAttributes<any[], void>;
}
