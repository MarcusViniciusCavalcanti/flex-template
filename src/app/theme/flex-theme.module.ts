import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  FLEX_BUILT_IN_JS_THEMES, FLEX_DOCUMENT,
  FLEX_JS_THEMES,
  FLEX_MEDIA_BREAKPOINTS,
  FLEX_THEME_OPTIONS, FLEX_WINDOW,
  FlexThemeOptions
} from './theme.options';
import { FlexJSThemeOptions } from './services/js-themes/theme.options';
import {
  DEFAULT_MEDIA_BREAKPOINTS,
  FlexMediaBreakpoint,
  FlexMediaBreakpointsService
} from './services/breakpoints/flex-breakpoints.service';
import { BUILT_IN_THEMES, FlexJSThemesRegistry } from './services/registry/js-themes-registry.service';
import { FlexThemeService } from './services/flex-theme.service';
import {
  FLEX_LAYOUT_DIRECTION,
  FlexLayoutDirection,
  FlexLayoutDirectionService
} from './services/direction/flex-direction.service';
import { FlexSpinnerService } from './services/spinner/flex-spinner.service';
import { FlexLayoutScrollService } from './services/scroll/flex-scroll.service';
import { FlexLayoutRulerService } from './services/rules/flex-ruler.service';
import { FlexOverlayModule } from './component/cdk/overlay/overlay.module';

export function flexWindowFactory() {
  return window;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class FlexThemeModule {
  static forRoot(flexThemeOptions: FlexThemeOptions = { name: 'default' },
                 flexJSThemeOptions?: FlexJSThemeOptions[],
                 flexMediaBreakpoints?: FlexMediaBreakpoint[],
                 layoutDirection?: FlexLayoutDirection): ModuleWithProviders {

    return {
      ngModule: FlexThemeModule,
      providers: [
        { provide: FLEX_THEME_OPTIONS, useValue: flexThemeOptions || {} },
        { provide: FLEX_BUILT_IN_JS_THEMES, useValue: BUILT_IN_THEMES },
        { provide: FLEX_JS_THEMES, useValue: flexJSThemeOptions || [] },
        { provide: FLEX_MEDIA_BREAKPOINTS, useValue: flexMediaBreakpoints || DEFAULT_MEDIA_BREAKPOINTS },
        { provide: FLEX_WINDOW, useFactory: flexWindowFactory },
        { provide: FLEX_DOCUMENT, useExisting: DOCUMENT },
        FlexJSThemesRegistry,
        FlexThemeService,
        FlexMediaBreakpointsService,
        FlexSpinnerService,
        { provide: FLEX_LAYOUT_DIRECTION, useValue: layoutDirection || FlexLayoutDirection.LTR },
        FlexLayoutDirectionService,
        FlexLayoutScrollService,
        FlexLayoutRulerService,
        ...FlexOverlayModule.forRoot().providers,
      ],
    } as ModuleWithProviders;
  }
}
