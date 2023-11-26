import LinterPlugin from 'src/main';
import { SearchOptionInfo } from 'src/option';
import { Rule } from 'src/rules';
import { Tab } from './tab';

export class RuleTab extends Tab {
  private rules: Rule[];

  constructor(
    navEl: HTMLElement,
    settingsEl: HTMLElement,
    ruleTypeName: string,
    rules: Rule[],
    isMobile: boolean,
    plugin: LinterPlugin
  ) {
    super(navEl, settingsEl, ruleTypeName, isMobile, plugin);
    this.rules = rules ?? [];
    this.display();
  }

  display(): void {
    for (const rule of this.rules) {
      const ruleDiv = this.contentEl.createDiv();
      ruleDiv.id = rule.alias;
      ruleDiv.createEl(this.isMobile ? 'h4' : 'h3', {}, (el) => {
        el.innerHTML = `<a href="${rule.getURL()}">${rule.getName()}</a>`;
      });

      const optionInfo = [] as SearchOptionInfo[];
      for (const option of rule.options) {
        option.display(ruleDiv, this.plugin.settings, this.plugin);
        optionInfo.push(option.getSearchInfo());
      }

      this.addSettingSearchInfo(
        ruleDiv,
        rule.getName().toLowerCase(),
        rule.getDescription().toLowerCase(),
        optionInfo,
        ruleDiv.id
      );
    }
  }
}
