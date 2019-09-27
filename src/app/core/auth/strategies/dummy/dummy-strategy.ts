import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { delay } from 'rxjs/operators';

import { FlexAuthStrategy } from '../auth-strategy';
import { FlexAuthResult } from '../../services/auth-result';
import { FlexDummyAuthStrategyOptions, dummyStrategyOptions } from './dummy-strategy-options';
import { FlexAuthStrategyClass } from '../../auth.options';

@Injectable()
export class FlexDummyAuthStrategy extends FlexAuthStrategy {

  protected defaultOptions: FlexDummyAuthStrategyOptions = dummyStrategyOptions;

  static setup(options: FlexDummyAuthStrategyOptions): [FlexAuthStrategyClass, FlexDummyAuthStrategyOptions] {
    return [FlexDummyAuthStrategy, options];
  }

  authenticate(data?: any): Observable<FlexAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  register(data?: any): Observable<FlexAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  requestPassword(data?: any): Observable<FlexAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  resetPassword(data?: any): Observable<FlexAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  logout(data?: any): Observable<FlexAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  refreshToken(data?: any): Observable<FlexAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  protected createDummyResult(data?: any): FlexAuthResult {

    if (this.getOption('alwaysFail')) {
      return new FlexAuthResult(
        false,
        this.createFailResponse(data),
        null,
        ['Something went wrong.'],
      );
    }

    try {
      const token = this.createToken('test token', true);
      return new FlexAuthResult(
        true,
        this.createSuccessResponse(data),
        '/',
        [],
        ['Successfully logged in.'],
        token,
      );
    } catch (err) {
      return new FlexAuthResult(
        false,
        this.createFailResponse(data),
        null,
        [err.message],
      );
    }
  }
}
