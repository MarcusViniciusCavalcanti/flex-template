import { async, inject, TestBed } from '@angular/core/testing';

import { DEFAULT_MEDIA_BREAKPOINTS, FlexMediaBreakpointsService } from './breakpoints/flex-breakpoints.service';
import { FlexThemeService } from './flex-theme.service';
import { BUILT_IN_THEMES, FlexJSThemesRegistry } from './registry/js-themes-registry.service';
import { FLEX_BUILT_IN_JS_THEMES, FLEX_JS_THEMES, FLEX_MEDIA_BREAKPOINTS, FLEX_THEME_OPTIONS, } from '../theme.options';

describe('theme-service', () => {
  let breakpointService: FlexMediaBreakpointsService;
  let themeService: FlexThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FLEX_MEDIA_BREAKPOINTS, useValue: DEFAULT_MEDIA_BREAKPOINTS },
        FlexMediaBreakpointsService,
        { provide: FLEX_JS_THEMES, useValue: [] },
        { provide: FLEX_BUILT_IN_JS_THEMES, useValue: BUILT_IN_THEMES },
        FlexJSThemesRegistry,
        { provide: FLEX_THEME_OPTIONS, useValue: { name: 'default' } },
        FlexThemeService,
      ],
    });
  });

  beforeEach(async(inject(
    [FlexMediaBreakpointsService, FlexThemeService],
    (breakpoint, theme) => {
      breakpointService = breakpoint;
      themeService = theme;
    },
  )));

  it('returns default theme specified in options', () => {
    let current: any;

    const subscription = themeService.onThemeChange()
      .subscribe((change: any) => {
        current = change;
      });
    try {
      expect(current.name).toEqual('default');
      expect(current.previous).toBeUndefined();
    } finally {
      subscription.unsubscribe();
    }
  });

  it('listens to theme change, saving a previous one', () => {
    let current: any;

    const subscription = themeService.onThemeChange()
      .subscribe((change: any) => {
        current = change;
      });
    try {
      expect(current.name).toEqual('default');
      expect(current.previous).toBeUndefined();

      themeService.changeTheme('cosmic');
      expect(current.name).toEqual('cosmic');
      expect(current.previous).toEqual('default');

      themeService.changeTheme('foobar');
      expect(current.name).toEqual('foobar');
      expect(current.previous).toEqual('cosmic');
    } finally {
      subscription.unsubscribe();
    }
  });

  it('listens to window media query change', () => {
    let current: any;

    const subscription = themeService.onMediaQueryChange()
      .subscribe((change: any) => {
        current = change;
      });
    try {
      expect(current).toBeUndefined();

      themeService.changeWindowWidth(1920);
      expect('unknown').toEqual(breakpointService.getByWidth(undefined).name);

      const xs = 200;
      themeService.changeWindowWidth(xs);
      expect(current[ 1 ].name).toEqual(breakpointService.getByWidth(xs).name);

      const sm = 576;
      themeService.changeWindowWidth(sm);
      expect(current[ 0 ].name).toEqual(breakpointService.getByWidth(xs).name);
      expect(current[ 1 ].name).toEqual(breakpointService.getByWidth(sm).name);
    } finally {
      subscription.unsubscribe();
    }
  });

  it('listens to theme variables change', () => {
    let current: any;

    const subscription = themeService.getJsTheme()
      .subscribe((change: any) => {
        current = change.variables;
      });
    try {
      expect(current).not.toBeUndefined();
      expect(current.fontMain).toEqual('Open Sans, sans-serif');
      expect(current.bg).toEqual('#ffffff');

      themeService.changeTheme('cosmic');
      expect(current.bg).toEqual('#323259');

      themeService.changeTheme('corporate');
      expect(current.bg).toEqual('#ffffff');

    } finally {
      subscription.unsubscribe();
    }
  });

});
