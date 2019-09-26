import { Inject, Injectable } from '@angular/core';

import { FlexJSThemeOptions } from '../js-themes/theme.options';
import { DEFAULT_THEME } from '../js-themes/default.theme';
import { COSMIC_THEME } from '../js-themes/cosmic.theme';
import { CORPORATE_THEME } from '../js-themes/corporate.theme';
import { DARK_THEME } from '../js-themes/dark.theme';
import { FLEX_BUILT_IN_JS_THEMES, FLEX_JS_THEMES } from '../../theme.options';


export const BUILT_IN_THEMES: FlexJSThemeOptions[] = [
  DEFAULT_THEME,
  COSMIC_THEME,
  CORPORATE_THEME,
  DARK_THEME,
];

@Injectable()
export class FlexJSThemesRegistry {

  private themes: any = {};

  constructor(@Inject(FLEX_BUILT_IN_JS_THEMES) builtInThemes: FlexJSThemeOptions[],
              @Inject(FLEX_JS_THEMES) newThemes: FlexJSThemeOptions[] = []) {

    const themes = this.combineByNames(newThemes, builtInThemes);

    themes.forEach((theme: any) => {
      this.register(theme, theme.name, theme.base);
    });
  }

  register(config: any, themeName: string, baseTheme: string) {
    const base = this.has(baseTheme) ? this.get(baseTheme) : {};
    this.themes[themeName] = this.mergeDeep({}, base, config);
  }

  has(themeName: string): boolean {
    return !!this.themes[themeName];
  }

  get(themeName: string): FlexJSThemeOptions {
    if (!this.themes[themeName]) {
      throw Error(`FlexThemeConfig: no theme '${themeName}' found registered.`);
    }
    return JSON.parse(JSON.stringify(this.themes[themeName]));
  }

  private combineByNames(newThemes: FlexJSThemeOptions[], oldThemes: FlexJSThemeOptions[]): FlexJSThemeOptions[] {
    if (newThemes) {
      const mergedThemes: FlexJSThemeOptions[] = [];
      newThemes.forEach((theme: FlexJSThemeOptions) => {
        const sameOld: FlexJSThemeOptions = oldThemes.find((tm: FlexJSThemeOptions) =>
          tm.name === theme.name) || {} as FlexJSThemeOptions;

        const mergedTheme = this.mergeDeep({}, sameOld, theme);
        mergedThemes.push(mergedTheme);
      });

      oldThemes.forEach((theme: FlexJSThemeOptions) => {
        if (!mergedThemes.find((tm: FlexJSThemeOptions) => tm.name === theme.name)) {
          mergedThemes.push(theme);
        }
      });
      return mergedThemes;
    }
    return oldThemes;
  }


  private isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  private mergeDeep(target, ...sources) {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.mergeDeep(target, ...sources);
  }
}
