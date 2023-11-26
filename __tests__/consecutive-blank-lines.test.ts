import ConsecutiveBlankLines from '../src/rules/consecutive-blank-lines';
import dedent from 'ts-dedent';
import { ruleTest } from './common';

ruleTest({
  RuleBuilderClass: ConsecutiveBlankLines,
  testCases: [
    {
      testName: 'Handles ignores code blocks',
      before: dedent`
        Line 1
        ${''}
        ${''}
        \`\`\`
        ${''}
        ${''}
        ${''}
        \`\`\`
      `,
      after: dedent`
        Line 1
        ${''}
        \`\`\`
        ${''}
        ${''}
        ${''}
        \`\`\`
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has spaces in it',
      before: dedent`
        Line 1
        ${''}
        ${'  '} 
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has a tab in it',
      before: dedent`
        Line 1
        ${''}
        ${''}\t
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has a carriage return in it',
      before: dedent`
        Line 1
        ${''}
        ${''}\r
        ${''}\v
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has a vertical tab in it',
      before: dedent`
        Line 1
        ${''}
        ${''}\v
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has a page break in it',
      before: dedent`
        Line 1
        ${''}
        ${''}\f
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has a page break in it',
      before: dedent`
        Line 1
        ${''}
        ${''}\f
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/529
      testName: 'Removes multiple empty lines when one of the lines just has multiple kinds of whitespace in it in it',
      before: dedent`
        Line 1
        ${''}
        ${''}\f \r\v\t\t\v
        Line 2
      `,
      after: dedent`
        Line 1
        ${''}
        Line 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/538
      testName:
        'Make sure that lists with a blank line between them are not affected since there are not 2 or more blank lines',
      before: dedent`
        - Item 1
        ${''}
          - Subitem 1
        ${''}
          - Subitem 2
        ${''}
            - Sub sub item 1
        ${''}
            - Sub sub item 2
      `,
      after: dedent`
        - Item 1
        ${''}
          - Subitem 1
        ${''}
          - Subitem 2
        ${''}
            - Sub sub item 1
        ${''}
            - Sub sub item 2
      `
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/543
      testName:
        'Make sure that nested code blocks with a blank line between them are not affected since there are not 2 or more blank lines',
      before: dedent`
        1. \`aaa\` bbbb,
        3. xxxxxxxxxxxxxxx

            \`\`\`csharp
            private IProcessor[] GetProcessors()
            {
                return returnedProcessors.ToArray();
            }
            \`\`\`

        4. ccccccc,
      `,
      after: dedent`
        1. \`aaa\` bbbb,
        3. xxxxxxxxxxxxxxx

            \`\`\`csharp
            private IProcessor[] GetProcessors()
            {
                return returnedProcessors.ToArray();
            }
            \`\`\`

        4. ccccccc,
      `
    }
  ]
});
