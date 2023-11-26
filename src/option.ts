import { Setting } from 'obsidian';
import { getTextInLanguage, LanguageStringKey } from './lang/helpers';
import LinterPlugin from './main';
import { LinterSettings } from './settings-data';
import { parseTextToHTMLWithoutOuterParagraph } from './ui/helpers';

export type SearchOptionInfo = { name: string; description: string; options?: DropdownRecord[] };

export type SupportedOptionTypes = string | boolean | number;

/** Class representing an option of a rule */
export abstract class Option<T extends SupportedOptionTypes = SupportedOptionTypes> {
  public ruleAlias: string;

  /**
   * Create an option
   * @param {LanguageStringKey} nameKey - The name key of the option
   * @param {LanguageStringKey} descriptionKey - The description key of the option
   * @param {T} defaultValue - The default value of the option
   * @param {string?} ruleAlias - The alias of the rule this option belongs to
   */
  constructor(
    public configKey: string,
    public nameKey: LanguageStringKey,
    public descriptionKey: LanguageStringKey,
    public defaultValue: T,
    ruleAlias?: string | null
  ) {
    if (ruleAlias) {
      this.ruleAlias = ruleAlias;
    }
  }

  public getName(): string {
    return getTextInLanguage(this.nameKey) ?? '';
  }

  public getDescription(): string {
    return getTextInLanguage(this.descriptionKey) ?? '';
  }

  public getSearchInfo(): SearchOptionInfo {
    return { name: this.getName(), description: this.getDescription() };
  }

  public abstract display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void;

  protected setOption(value: T, settings: LinterSettings): void {
    settings.ruleConfigs[this.ruleAlias][this.configKey] = value;
  }

  protected parseNameAndDescriptionAndRemoveSettingBorder(setting: Setting, plugin: LinterPlugin) {
    parseTextToHTMLWithoutOuterParagraph(this.getName(), setting.nameEl, plugin.settingsTab.component);
    parseTextToHTMLWithoutOuterParagraph(this.getDescription(), setting.descEl, plugin.settingsTab.component);

    // remove border around every setting item
    setting.settingEl.style.border = 'none';
  }
}

export class BooleanOption extends Option<boolean> {
  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl).addToggle((toggle) => {
      toggle.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
      toggle.onChange((value) => {
        this.setOption(value, settings);
        plugin.settings = settings;
        plugin.saveData(plugin.settings);
      });
    });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class TextOption extends Option<string> {
  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl).addText((textbox) => {
      textbox.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
      textbox.onChange((value) => {
        this.setOption(value, settings);
        plugin.settings = settings;
        plugin.saveData(plugin.settings);
      });
    });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class TextAreaOption extends Option<string> {
  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl).addTextArea((textbox) => {
      textbox.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
      textbox.onChange((value) => {
        this.setOption(value, settings);
        plugin.settings = settings;
        plugin.saveData(plugin.settings);
      });
    });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class MomentFormatOption extends Option<string> {
  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl).addMomentFormat((format) => {
      format.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);
      format.setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a');
      format.onChange((value) => {
        this.setOption(value, settings);
        plugin.settings = settings;
        plugin.saveData(plugin.settings);
      });
    });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}

export class DropdownRecord {
  public value: LanguageStringKey;
  public description: string;

  constructor(value: LanguageStringKey, description: string) {
    this.value = value;
    this.description = description;
  }

  getDisplayValue(): string {
    return getTextInLanguage(this.value) ?? '';
  }
}

export class DropdownOption extends Option<string> {
  public options: DropdownRecord[];

  constructor(
    configKey: string,
    nameKey: LanguageStringKey,
    descriptionKey: LanguageStringKey,
    defaultValue: string,
    options: DropdownRecord[],
    ruleAlias?: string | null
  ) {
    super(configKey, nameKey, descriptionKey, defaultValue, ruleAlias);
    this.options = options;
  }

  public getSearchInfo(): SearchOptionInfo {
    return { name: this.getName(), description: this.getDescription(), options: this.options };
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl).addDropdown((dropdown) => {
      // First, add all the available options
      for (const option of this.options) {
        dropdown.addOption(option.value.replace('enums.', ''), option.getDisplayValue());
      }

      // Set currently selected value from existing settings
      dropdown.setValue(settings.ruleConfigs[this.ruleAlias][this.configKey]);

      dropdown.onChange((value) => {
        this.setOption(value, settings);
        plugin.settings = settings;
        plugin.saveData(plugin.settings);
      });
    });

    this.parseNameAndDescriptionAndRemoveSettingBorder(setting, plugin);
  }
}
