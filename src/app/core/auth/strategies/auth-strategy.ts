import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlexAuthResult } from '../services/auth-result';
import { FlexAuthStrategyOptions } from './auth-strategy-options';
import { deepExtend, getDeepFromObject } from '../helpers';
import {
  FlexAuthToken,
  authCreateToken,
  FlexAuthIllegalTokenError,
} from '../services/token/token';

export abstract class FlexAuthStrategy {

  protected defaultOptions: FlexAuthStrategyOptions;
  protected options: FlexAuthStrategyOptions;

  // we should keep this any and validation should be done in `register` method instead
  // otherwise it won't be possible to pass an empty object
  setOptions(options: any): void {
    this.options = deepExtend({}, this.defaultOptions, options);
  }

  getOption(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  createToken<T extends FlexAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
    const token =  authCreateToken<T>(this.getOption('token.class'), value, this.getName());
    // At this point, nbAuthCreateToken failed with NbAuthIllegalTokenError which MUST be intercepted by strategies
    // Or token is created. It MAY be created even if backend did not return any token, in this case it is !Valid
    if (failWhenInvalidToken && !token.isValid()) {
      // If we require a valid token (i.e. isValid), then we MUST throw NbAuthIllegalTokenError so that the strategies
      // intercept it
      throw new FlexAuthIllegalTokenError('Token is empty or invalid.');
    }
    return token;
  }

  getName(): string {
    return this.getOption('name');
  }

  abstract authenticate(data?: any): Observable<FlexAuthResult>;

  abstract register(data?: any): Observable<FlexAuthResult>;

  abstract requestPassword(data?: any): Observable<FlexAuthResult>;

  abstract resetPassword(data?: any): Observable<FlexAuthResult>;

  abstract logout(): Observable<FlexAuthResult>;

  abstract refreshToken(data?: any): Observable<FlexAuthResult>;

  protected createFailResponse(data?: any): HttpResponse<Object> {
    return new HttpResponse<Object>({ body: {}, status: 401 });
  }

  protected createSuccessResponse(data?: any): HttpResponse<Object> {
    return new HttpResponse<Object>({ body: {}, status: 200 });
  }

  protected getActionEndpoint(action: string): string {
    const actionEndpoint: string = this.getOption(`${action}.endpoint`);
    const baseEndpoint: string = this.getOption('baseEndpoint');
    return actionEndpoint ? baseEndpoint + actionEndpoint : '';
  }
}
