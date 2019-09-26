export interface FlexJSThemeOptions {
  name: string;
  base?: string;
  variables?: FlexJSThemeVariable;
}

export interface FlexJSThemeVariable {
  [key: string]: string | string[] | FlexJSThemeVariable;
}
