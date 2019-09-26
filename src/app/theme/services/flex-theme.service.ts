import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FLEX_THEME_OPTIONS } from '../theme.options';
import { FlexMediaBreakpoint, FlexMediaBreakpointsService } from './breakpoints/flex-breakpoints.service';
import { FlexJSThemesRegistry } from './registry/js-themes-registry.service';
import { FlexJSThemeOptions } from './js-themes/theme.options';
import { distinctUntilChanged, filter, map, pairwise, share, startWith } from 'rxjs/operators';

@Injectable()
export class FlexThemeService {

  currentTheme: string;

  private themeChanges$ = new ReplaySubject(1);

  private appendLayoutClass$ = new Subject();

  private removeLayoutClass$ = new Subject();

  private changeWindowWidth$ = new ReplaySubject<number>(2);

  constructor(@Inject(FLEX_THEME_OPTIONS) protected options: any,
              private breakpointService: FlexMediaBreakpointsService,
              private jsThemesRegistry: FlexJSThemesRegistry) {
    if (options && options.name) {
      this.changeTheme(options.name);
    }
  }

  changeTheme(name: string): void {
    this.themeChanges$.next({ name, previous: this.currentTheme });
    this.currentTheme = name;
  }

  changeWindowWidth(width: number): void {
    this.changeWindowWidth$.next(width);
  }

  getJsTheme(): Observable<FlexJSThemeOptions> {
    return this.onThemeChange().pipe(
      map((theme: any) => {
        return this.jsThemesRegistry.get(theme.name);
      }),
    );
  }

  onMediaQueryChange(): Observable<FlexMediaBreakpoint[]> {
    return this.changeWindowWidth$
      .pipe(
        startWith(null as string),
        pairwise(),
        map(([prevWidth, width]: [number, number]) => {
          return [
            this.breakpointService.getByWidth(prevWidth),
            this.breakpointService.getByWidth(width),
          ];
        }),
        filter(([prevPoint, point]: [FlexMediaBreakpoint, FlexMediaBreakpoint]) => {
          return prevPoint.name !== point.name;
        }),
        distinctUntilChanged(null, params => params[0].name + params[1].name),
        share(),
      );
  }

  onThemeChange(): Observable<any> {
    return this.themeChanges$.pipe(share());
  }

  appendLayoutClass(className: string) {
    this.appendLayoutClass$.next(className);
  }

  onAppendLayoutClass(): Observable<any> {
    return this.appendLayoutClass$.pipe(share());
  }

  removeLayoutClass(className: string) {
    this.removeLayoutClass$.next(className);
  }

  onRemoveLayoutClass(): Observable<any> {
    return this.removeLayoutClass$.pipe(share());
  }
}
