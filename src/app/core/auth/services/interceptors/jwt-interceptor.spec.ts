import { Injector } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { FlexAuthJWTToken, FlexAuthSimpleToken } from '../token/token';
import { FlexAuthService } from '../auth.service';
import { FLEX_AUTH_FALLBACK_TOKEN, FlexAuthTokenParceler } from '../token/token-parceler';
import {
  FLEX_AUTH_OPTIONS,
  FLEX_AUTH_STRATEGIES,
  FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER,
  FLEX_AUTH_TOKENS,
  FLEX_AUTH_USER_OPTIONS
} from '../../auth.options';
import { FlexTokenService } from '../token/token.service';
import { FlexDummyAuthStrategy } from '../../strategies/dummy/dummy-strategy';
import { optionsFactory, strategiesFactory } from '../../auth.module';
import { FlexTokenLocalStorage, FlexTokenStorage } from '../token/token-storage';
import { FlexAuthJWTInterceptor } from './jwt-interceptor';



describe('jwt-interceptor', () => {

  // tslint:disable
  const validJWTValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjZXJlbWEuZnIiLCJpYXQiOjE1MzIzNTA4MDAsImV4cCI6MjUzMjM1MDgwMCwic3ViIjoiQWxhaW4gQ0hBUkxFUyIsImFkbWluIjp0cnVlfQ.Rgkgb4KvxY2wp2niXIyLJNJeapFp9z3tCF-zK6Omc8c';
  const validJWTToken = new FlexAuthJWTToken(validJWTValue, 'dummy');
  const expiredJWTToken = new FlexAuthJWTToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjEzMDA4MTkzODAsIm5hbWUiOiJDaHJpcyBTZXZpbGxlamEiLCJhZG1pbiI6dHJ1ZX0.03f329983b86f7d9a9f5fef85305880101d5e302afafa20154d094b229f75773','dummy');
  const authHeader = 'Bearer ' + validJWTValue;

  let authService: FlexAuthService;
  let tokenService: FlexTokenService;

  let http: HttpClient;
  let httpMock: HttpTestingController;

  let dummyAuthStrategy: FlexDummyAuthStrategy;

  function filterInterceptorRequest(req: HttpRequest<any>): boolean {
    return ['/filtered/url']
      .some(url => req.url.includes(url));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
         { provide: FLEX_AUTH_FALLBACK_TOKEN, useValue: FlexAuthSimpleToken },
         { provide: FLEX_AUTH_TOKENS, useValue: [FlexAuthJWTToken] },
        FlexAuthTokenParceler,
         {
          provide: FLEX_AUTH_USER_OPTIONS, useValue: {
            strategies: [
              FlexDummyAuthStrategy.setup({
                alwaysFail: false,
                name: 'dummy',
              }),
            ],
          },
        },
        { provide: FLEX_AUTH_OPTIONS, useFactory: optionsFactory, deps: [FLEX_AUTH_USER_OPTIONS] },
        { provide: FLEX_AUTH_STRATEGIES, useFactory: strategiesFactory, deps: [FLEX_AUTH_OPTIONS, Injector] },
        { provide: FlexTokenStorage, useClass: FlexTokenLocalStorage },
        { provide: HTTP_INTERCEPTORS, useClass: FlexAuthJWTInterceptor, multi: true },
        { provide: FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
        FlexTokenService,
        FlexAuthService,
        FlexDummyAuthStrategy,
      ],
    });
    authService = TestBed.get(FlexAuthService);
    tokenService = TestBed.get(FlexTokenService);
    dummyAuthStrategy = TestBed.get(FlexDummyAuthStrategy);
  });

    beforeEach(async(
      inject([HttpClient, HttpTestingController], (_httpClient, _httpMock) => {
        http = _httpClient;
        httpMock = _httpMock;
      }),
    ));

    it ('Url filtered, isAuthenticatedOrRefresh not called, token not added', () => {
      const spy = spyOn(authService, 'isAuthenticatedOrRefresh');
      http.get('/filtered/url/').subscribe(res => {
        expect(spy).not.toHaveBeenCalled();
      });
      httpMock.expectOne(
        req => req.url === '/filtered/url/'
          && ! req.headers.get('Authorization'),
      ).flush({});
    });

    it ('Url not filtered, isAuthenticatedOrRefresh called, authenticated, token added', () => {
      const spy = spyOn(authService, 'isAuthenticatedOrRefresh')
        .and.
        returnValue(observableOf(true));
      spyOn(authService, 'getToken')
        .and
        .returnValue(observableOf(validJWTToken));
      http.get('/notfiltered/url/').subscribe(res => {
        expect(spy).toHaveBeenCalled();
      });
      httpMock.expectOne(
        req => req.url === '/notfiltered/url/'
          && req.headers.get('Authorization') === authHeader,
      ).flush({});
    });

    it ('Url not filtered, isAuthenticatedOrRefresh called, not authenticated, token not added', () => {
      const spy = spyOn(authService, 'isAuthenticatedOrRefresh')
        .and.
        returnValue(observableOf(false));
      spyOn(authService, 'getToken')
        .and
        .returnValue(observableOf(expiredJWTToken));
      http.get('/notfiltered/url/').subscribe(res => {
        expect(spy).toHaveBeenCalled();
      });
      httpMock.expectOne(
        req => req.url === '/notfiltered/url/'
          && ! req.headers.get('Authorization'),
      ).flush({});
    });

  },
);
