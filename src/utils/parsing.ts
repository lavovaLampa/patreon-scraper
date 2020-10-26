import { OptionDefinition, ParseResult } from "../../type/utils/parsing"
import { Maybe } from "../../type/common"

const defaultValues: ParseResult = {
  outputDir: "./attachment_out",
  printHelp: false,
  sessionId: null
}

const availableOpts: readonly OptionDefinition[] = [
  {
    optionRef: "sessionId",
    longOpt: "--sessionId",
    shortOpt: "-s",
    isBool: false,
    alreadyUsed: false
  },
  {
    optionRef: "outputDir",
    longOpt: "--outputDir",
    shortOpt: "-o",
    isBool: false,
    alreadyUsed: false
  },
  {
    optionRef: "printHelp",
    longOpt: "--help",
    shortOpt: "-h",
    isBool: true,
    alreadyUsed: false
  }
]

export class CmdOptionsParser {
  private currOptions: ParseResult = defaultValues

  public parseOptions(): ParseResult {
    // we don't want default arguments
    const currArgs = process.argv.slice(2)

    let i = 0
    while (i < currArgs.length) {
      const currToken = currArgs[i]

      if (currToken.startsWith("-")) {
        const parseResult = this.getCurrentOption(currToken)

        if (parseResult) {
          if (parseResult[1]) {
            /// @ts-ignore
            this.currOptions[parseResult[0]] = true
            i++
          } else if (i + 1 < currArgs.length) {
            /// @ts-ignore
            this.currOptions[parseResult[0]] = currArgs[i + 1]
            i += 2
          } else {
            console.error("No value specified for current argument")
            i++
          }
        }
      } else {
        console.error("Problem parsing arguments, try running with --help")
        process.exit(1)
      }
    }

    return this.currOptions
  }

  private getCurrentOption(
    parsedOption: string
  ): Maybe<[keyof ParseResult, boolean]> | never {
    for (const opt of availableOpts) {
      if (parsedOption === opt.longOpt || parsedOption === opt.shortOpt) {
        // check if the same option wasn't specified multiple times
        if (opt.alreadyUsed) {
          console.error(`Multiple values for option: ${opt.longOpt}`)
          process.exit(1)
        } else {
          return [opt.optionRef, opt.isBool]
        }
      }
    }

    console.error(`Invalid option: ${parsedOption}, try running with --help`)
    return null
  }
}
