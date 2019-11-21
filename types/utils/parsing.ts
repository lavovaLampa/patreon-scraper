import { Maybe } from "../common"

export interface OptionDefinition {
  optionRef: keyof ParseResult
  alreadyUsed: boolean
  longOpt: string
  shortOpt?: string
  isBool: boolean
}

export interface ParseResult {
  sessionId: Maybe<string>
  outputDir: string
  printHelp: boolean
}
