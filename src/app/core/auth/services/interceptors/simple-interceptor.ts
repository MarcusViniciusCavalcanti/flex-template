import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FlexAuthService } from '../auth.service';
import { FLEX_AUTH_INTERCEPTOR_HEADER } from '../../auth.options';
import { FlexAuthJWTToken } from '../token/token';

@Injectable()
export class FlexAuthSimpleInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
              @Inject(FLEX_AUTH_INTERCEPTOR_HEADER) protected headerName: string = 'Authorization') {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.authService.getToken()
      .pipe(
        switchMap((token: FlexAuthJWTToken) => {
          if (token && token.getValue()) {
            req = req.clone({
              setHeaders: {
                [this.headerName]: token.getValue(),
              },
            });
          }
          return next.handle(req);
        }),
      );
  }

  protected get authService(): FlexAuthService {
    return this.injector.get(FlexAuthService);
  }
}
