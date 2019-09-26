import { InjectionToken } from '@angular/core';
import {FlexMediaBreakpoint} from './services/breakpoints/flex-breakpoints.service';
import {FlexJSThemeOptions} from './services/js-themes/theme.options';

export interface FlexThemeOptions {
  name: string;
}

export const FLEX_THEME_OPTIONS = new InjectionToken<FlexThemeOptions>('Flex-Theme Options');
export const FLEX_MEDIA_BREAKPOINTS = new InjectionToken<FlexMediaBreakpoint[]>('Flex-Theme Media Breakpoints');
export const FLEX_BUILT_IN_JS_THEMES = new InjectionToken<FlexJSThemeOptions[]>('Flex-Theme Built-in JS Themes');
export const FLEX_JS_THEMES = new InjectionToken<FlexJSThemeOptions[]>('Flex-Theme JS Themes');
export const FLEX_WINDOW = new InjectionToken<Window>('Window');
export const FLEX_DOCUMENT = new InjectionToken<Document>('Document');
