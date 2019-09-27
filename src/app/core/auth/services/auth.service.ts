import { Inject, Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { FlexAuthStrategy } from '../strategies/auth-strategy';
import { FLEX_AUTH_STRATEGIES } from '../auth.options';
import { FlexAuthResult } from './auth-result';
import { FlexTokenService } from './token/token.service';
import { FlexAuthToken } from './token/token';

@Injectable()
export class FlexAuthService {

  constructor(protected tokenService: FlexTokenService,
              @Inject(FLEX_AUTH_STRATEGIES) protected strategies) {
  }

  getToken(): Observable<FlexAuthToken> {
    return this.tokenService.get();
  }

  isAuthenticated(): Observable<boolean> {
    return this.getToken()
      .pipe(map((token: FlexAuthToken) => token.isValid()));
  }

  isAuthenticatedOrRefresh(): Observable<boolean> {
    return this.getToken()
      .pipe(
        switchMap(token => {
        if (token.getValue() && !token.isValid()) {
          return this.refreshToken(token.getOwnerStrategyName(), token)
            .pipe(
              switchMap(res => {
                if (res.isSuccess()) {
                  return this.isAuthenticated();
                } else {
                  return observableOf(false);
                }
              }),
            );
        } else {
          return observableOf(token.isValid());
        }
    }));
  }

  onTokenChange(): Observable<FlexAuthToken> {
    return this.tokenService.tokenChange();
  }

  onAuthenticationChange(): Observable<boolean> {
    return this.onTokenChange()
      .pipe(map((token: FlexAuthToken) => token.isValid()));
  }

  authenticate(strategyName: string, data?: any): Observable<FlexAuthResult> {
    return this.getStrategy(strategyName).authenticate(data)
      .pipe(
        switchMap((result: FlexAuthResult) => {
          return this.processResultToken(result);
        }),
      );
  }

  register(strategyName: string, data?: any): Observable<FlexAuthResult> {
    return this.getStrategy(strategyName).register(data)
      .pipe(
        switchMap((result: FlexAuthResult) => {
          return this.processResultToken(result);
        }),
      );
  }

  logout(strategyName: string): Observable<FlexAuthResult> {
    return this.getStrategy(strategyName).logout()
      .pipe(
        switchMap((result: FlexAuthResult) => {
          if (result.isSuccess()) {
            this.tokenService.clear()
              .pipe(map(() => result));
          }
          return observableOf(result);
        }),
      );
  }

  requestPassword(strategyName: string, data?: any): Observable<FlexAuthResult> {
    return this.getStrategy(strategyName).requestPassword(data);
  }

  resetPassword(strategyName: string, data?: any): Observable<FlexAuthResult> {
    return this.getStrategy(strategyName).resetPassword(data);
  }

  refreshToken(strategyName: string, data?: any): Observable<FlexAuthResult> {
    return this.getStrategy(strategyName).refreshToken(data)
      .pipe(
        switchMap((result: FlexAuthResult) => {
          return this.processResultToken(result);
        }),
      );
  }

  protected getStrategy(strategyName: string): FlexAuthStrategy {
    const found = this.strategies.find((strategy: FlexAuthStrategy) => strategy.getName() === strategyName);

    if (!found) {
      throw new TypeError(`There is no Auth Strategy registered under '${strategyName}' name`);
    }

    return found;
  }

  private processResultToken(result: FlexAuthResult) {
    if (result.isSuccess() && result.getToken()) {
      return this.tokenService.set(result.getToken())
        .pipe(
          map((token: FlexAuthToken) => {
            return result;
          }),
        );
    }

    return observableOf(result);
  }
}
