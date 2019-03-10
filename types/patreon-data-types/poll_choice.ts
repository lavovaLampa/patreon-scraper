import { DataTypeKey, ICommonAttributes, ICommonDataProperties } from "../response";

export interface IPollChoice extends ICommonDataProperties {
  attributes: IPollChoiceAttributes;
  type: DataTypeKey.PollChoice;
}

interface IPollChoiceAttributes extends ICommonAttributes {
  choice_type: ChoiceTypeTypeKey;
  num_responses: number;
  position: number;
  text_content: string;
}

enum ChoiceTypeTypeKey {
  Toggle = "toggle",
}
