import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties,
  CommonRelationships,
  GenericRelationshipAttributes
} from "../response"

export interface IAccessRule extends CommonDataProperties {
  attributes: IAccessRuleAttributes
  relationships: IAccessRuleRelationships
  type: DataTypeKey.AccessRule
}

interface IAccessRuleAttributes extends CommonAttributes {
  access_rule_type: AccessRuleTypeKey
  amount_cents: number | null
  post_count: number
}

enum AccessRuleTypeKey {
  Patrons = "patrons"
}

interface IAccessRuleRelationships extends CommonRelationships {
  tier?: GenericRelationshipAttributes<any | null, void>
}
