import { setIcon } from 'obsidian';
import { LanguageStringKey, getTextInLanguage } from 'src/lang/helpers';
import LinterPlugin from 'src/main';
import { SearchOptionInfo } from 'src/option';
import { RuleType } from 'src/rules';
import { hideEl, unhideEl } from 'src/ui/helpers';
import { iconInfo } from 'src/ui/icons';
import { settingSearchInfo } from './tab-searcher';

export enum SearchStatus {
  LeavingSearchMode = 'leaving search mode by selecting a tab',
  EnteringSearchMode = 'entering search mode by focusing on the search input box',
  None = 'the status is still the same'
}

const tabNameToTabIconId: Record<string | RuleType, string> = {
  General: iconInfo.general.id,
  Custom: iconInfo.custom.id,
  YAML: iconInfo.yaml.id,
  Heading: iconInfo.heading.id,
  Footnote: iconInfo.footer.id,
  Content: iconInfo.content.id,
  Spacing: iconInfo.whitespace.id,
  Paste: iconInfo.paste.id,
  Debug: iconInfo.debug.id
};

const tabNameToTextKey: Record<string | RuleType, LanguageStringKey> = {
  General: 'tabs.names.general',
  Custom: 'tabs.names.custom',
  YAML: 'tabs.names.yaml',
  Heading: 'tabs.names.heading',
  Footnote: 'tabs.names.footnote',
  Content: 'tabs.names.content',
  Spacing: 'tabs.names.spacing',
  Paste: 'tabs.names.paste',
  Debug: 'tabs.names.debug'
};

export abstract class Tab {
  contentEl: HTMLDivElement;
  headingEl: HTMLElement;
  navButton: HTMLDivElement;
  searchSettingInfo: settingSearchInfo[] = [];
  constructor(
    navEl: HTMLElement,
    settingsEl: HTMLElement,
    public name: string,
    public isMobile: boolean,
    protected plugin: LinterPlugin
  ) {
    this.navButton = navEl.createDiv('linter-navigation-item');
    let tabClass = 'linter-desktop';
    if (isMobile) {
      tabClass = 'linter-mobile';
    }

    this.navButton.addClass(tabClass);
    setIcon(this.navButton.createSpan({ cls: 'linter-navigation-item-icon' }), tabNameToTabIconId[name]);

    const nameInLanguage = getTextInLanguage(tabNameToTextKey[name]);
    this.navButton.createSpan().setText(nameInLanguage);

    this.contentEl = settingsEl.createDiv('linter-tab-settings');
    this.contentEl.id = name.toLowerCase().replace(' ', '-');

    this.headingEl = this.contentEl.createEl('h2', { text: nameInLanguage });
    hideEl(this.headingEl);
  }

  abstract display(): void;

  addSettingSearchInfo(
    containerEl: HTMLDivElement,
    name: string = '',
    description: string = '',
    options: SearchOptionInfo[] = null,
    alias: string = null
  ) {
    this.searchSettingInfo.push({
      containerEl: containerEl,
      name: name.toLowerCase(),
      description: description.toLowerCase(),
      options: options,
      alias: alias
    });
  }

  updateTabDisplayMode(isSelected: boolean, searchStatus: SearchStatus = SearchStatus.None) {
    if (isSelected) {
      this.navButton.addClass('linter-navigation-item-selected');
      unhideEl(this.contentEl);
    } else {
      this.navButton.removeClass('linter-navigation-item-selected');
      hideEl(this.contentEl);
    }

    switch (searchStatus) {
      case SearchStatus.EnteringSearchMode:
        unhideEl(this.contentEl);
        unhideEl(this.headingEl);
        for (const setting of this.searchSettingInfo) {
          unhideEl(setting.containerEl);
        }
        break;
      case SearchStatus.LeavingSearchMode:
        hideEl(this.headingEl);
        for (const setting of this.searchSettingInfo) {
          unhideEl(setting.containerEl);
        }
        break;
    }
  }
}
