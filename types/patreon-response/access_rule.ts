import {
  DataTypeKey, ICommonAttributes, ICommonDataProperties,
  ICommonRelationships, IGenericRelationshipAttributes,
} from "../common";

export interface IAccessRule extends ICommonDataProperties {
  attributes: IAccessRuleAttributes;
  relationships: IAccessRuleRelationships;
  type: DataTypeKey.AccessRule;
}

interface IAccessRuleAttributes extends ICommonAttributes {
  access_rule_type: AccessRuleTypeKey;
  amount_cents: number | null;
  post_count: number;
}

enum AccessRuleTypeKey {
  Patrons = "patrons",
}

interface IAccessRuleRelationships extends ICommonRelationships {
  tier?: IGenericRelationshipAttributes<any | null, void>;
}
