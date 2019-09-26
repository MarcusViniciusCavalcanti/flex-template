import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { filter, pairwise, map, startWith } from 'rxjs/operators';
import { getPathPartOfUrl } from '../menu/url-matching-helpers';

@Injectable()
export class FlexRestoreScrollTopHelper {

  constructor(private router: Router) {}

  shouldRestore(): Observable<boolean> {
    return this.router.events
      .pipe(
        startWith(null as string),
        filter(event => event === null || event instanceof NavigationEnd),
        pairwise(),
        map(([prev, current]: [NavigationEnd, NavigationEnd]) => this.pageChanged(prev, current)),
        filter(res => !!res),
      );
  }

  private pageChanged(prev: NavigationEnd, current: NavigationEnd) {
    return !prev || getPathPartOfUrl(prev.url) !== getPathPartOfUrl(current.url);
  }
}
