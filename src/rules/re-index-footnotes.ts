import { Options, RuleType } from '../rules';
import RuleBuilder, { ExampleBuilder, OptionBuilderBase } from './rule-builder';
import dedent from 'ts-dedent';
import { IgnoreTypes } from '../utils/ignore-types';
import { reIndexFootnotes } from '../utils/mdast';

class ReIndexFootnotesOptions implements Options {}

@RuleBuilder.register
export default class ReIndexFootnotes extends RuleBuilder<ReIndexFootnotesOptions> {
  constructor() {
    super({
      nameKey: 'rules.re-index-footnotes.name',
      descriptionKey: 'rules.re-index-footnotes.description',
      type: RuleType.FOOTNOTE,
      ruleIgnoreTypes: [
        IgnoreTypes.code,
        IgnoreTypes.inlineCode,
        IgnoreTypes.math,
        IgnoreTypes.yaml,
        IgnoreTypes.link,
        IgnoreTypes.wikiLink,
        IgnoreTypes.tag
      ]
    });
  }
  get OptionsClass(): new () => ReIndexFootnotesOptions {
    return ReIndexFootnotesOptions;
  }
  apply(text: string, options: ReIndexFootnotesOptions): string {
    return reIndexFootnotes(text);
  }
  get exampleBuilders(): ExampleBuilder<ReIndexFootnotesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Re-indexing footnotes after having deleted previous footnotes',
        before: dedent`
          Lorem ipsum at aliquet felis.[^3] Donec dictum turpis quis pellentesque,[^5] et iaculis tortor condimentum.
          ${''}
          [^3]: first footnote
          [^5]: second footnote
        `,
        after: dedent`
          Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.
          ${''}
          [^1]: first footnote
          [^2]: second footnote
        `
      }),
      new ExampleBuilder({
        description: 'Re-indexing footnotes after inserting a footnote between',
        before: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.
          ${''}
          [^1]: first footnote
          [^1a]: third footnote, inserted later
          [^2]: second footnotes
        `,
        after: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.
          ${''}
          [^1]: first footnote
          [^2]: third footnote, inserted later
          [^3]: second footnotes
        `
      }),
      new ExampleBuilder({
        description: 'Re-indexing footnotes preserves multiple references to the same footnote index',
        before: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.[^1]
          ${''}
          [^1]: first footnote
          [^1a]: third footnote, inserted later
          [^2]: second footnotes
        `,
        after: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.[^1]
          ${''}
          [^1]: first footnote
          [^2]: third footnote, inserted later
          [^3]: second footnotes
        `
      }),
      new ExampleBuilder({
        // accounts for https://github.com/platers/obsidian-linter/issues/466
        description: 'Re-indexing footnotes condense duplicate footnotes into 1 when key and footnote are the same',
        before: dedent`
          bla[^1], bla[^1], bla[^2]
          [^1]: bla
          [^1]: bla
          [^2]: bla
        `,
        after: dedent`
          bla[^1], bla[^1], bla[^2]
          ${''}
          [^1]: bla
          [^2]: bla
        `
      })
    ];
  }
  get optionBuilders(): OptionBuilderBase<ReIndexFootnotesOptions>[] {
    return [];
  }
}
