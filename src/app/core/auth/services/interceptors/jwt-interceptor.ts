import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FlexAuthToken } from '../token/token';
import { FlexAuthService } from '../auth.service';
import { FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER } from '../../auth.options';

@Injectable()
export class FlexAuthJWTInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
              @Inject(FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (!this.filter(req)) {
        return this.authService.isAuthenticatedOrRefresh()
          .pipe(
            switchMap(authenticated => {
              if (authenticated) {
                  return this.authService.getToken().pipe(
                    switchMap((token: FlexAuthToken) => {
                      const JWT = `Bearer ${token.getValue()}`;
                      req = req.clone({
                        setHeaders: {
                          Authorization: JWT,
                        },
                      });
                      return next.handle(req);
                    }),
                  );
              } else {
                return next.handle(req);
              }
            }),
          );
      } else {
      return next.handle(req);
    }
  }

  protected get authService(): FlexAuthService {
    return this.injector.get(FlexAuthService);
  }

}
