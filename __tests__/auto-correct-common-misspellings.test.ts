import AutoCorrectCommonMisspellings from '../src/rules/auto-correct-common-misspellings';
import dedent from 'ts-dedent';
import { ruleTest } from './common';

ruleTest({
  RuleBuilderClass: AutoCorrectCommonMisspellings,
  testCases: [
    {
      testName: "Doesn't auto-correct markdown and wiki links",
      before: dedent`
        [[absoltely not a changed]]
        [absoltely not a changed](absoltely.not.changed.md)
      `,
      after: dedent`
        [[absoltely not a changed]]
        [absoltely not a changed](absoltely.not.changed.md)
      `
    },
    {
      testName: "Doesn't auto-correct markdown and wiki images",
      before: dedent`
        ![[absoltely.not.a.changed.jpg]]
        ![absoltely not a changed](absoltely.not.changed.md)
      `,
      after: dedent`
        ![[absoltely.not.a.changed.jpg]]
        ![absoltely not a changed](absoltely.not.changed.md)
      `
    },
    {
      testName: "Doesn't auto-correct words that start with unicode specific characters when not in correction list",
      before: dedent`
        être
      `,
      after: dedent`
        être
      `
    }
  ]
});
