import { async, inject, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { FlexTokenLocalStorage, FlexTokenStorage } from './token-storage';
import { FlexAuthJWTToken, FlexAuthSimpleToken, FlexAuthToken, authCreateToken } from './token';
import { FlexTokenService } from './token.service';
import { FLEX_AUTH_FALLBACK_TOKEN, FlexAuthTokenParceler } from './token-parceler';
import { FLEX_AUTH_TOKENS } from '../../auth.options';

const noop = () => {};
const ownerStrategyName = 'strategy';

describe('token-service', () => {

  let tokenService: FlexTokenService;
  let tokenStorage: FlexTokenLocalStorage;
  const simpleToken = authCreateToken(FlexAuthSimpleToken, 'test value', ownerStrategyName);
  const emptyToken = authCreateToken(FlexAuthSimpleToken, '', ownerStrategyName);
  const testTokenKey = 'auth_app_token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FlexTokenStorage, useClass: FlexTokenLocalStorage },
        { provide: FLEX_AUTH_FALLBACK_TOKEN, useValue: FlexAuthSimpleToken },
        { provide: FLEX_AUTH_TOKENS, useValue: [FlexAuthSimpleToken, FlexAuthJWTToken] },
        FlexAuthTokenParceler,
        FlexTokenService,
      ],
    });
  });

    beforeEach(async(inject(
    [FlexTokenService, FlexTokenStorage],
    (_tokenService, _tokenStorage) => {
      tokenService = _tokenService;
      tokenStorage = _tokenStorage;
    },
  )));

  afterEach(() => {
    localStorage.removeItem(testTokenKey);
  });

  it('set calls storage set', () => {

    const spy = spyOn(tokenStorage, 'set')
      .and
      .returnValue(null);

    tokenService.set(simpleToken).subscribe(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('get return null in case token was not set', () => {

    const spy = spyOn(tokenStorage, 'get')
      .and
      .returnValue(emptyToken);

    tokenService.get()
      .subscribe((token: FlexAuthToken) => {
        expect(spy).toHaveBeenCalled();
        expect(token.getValue()).toEqual('');
        expect(token.isValid()).toBe(false);
      })
  });

  it('should return correct value', () => {
    tokenService.set(simpleToken).subscribe(noop);

    tokenService.get()
      .subscribe((token: FlexAuthToken) => {
        expect(token.getValue()).toEqual(simpleToken.getValue());
      });
  });

  it('clear remove token', () => {

    const spy = spyOn(tokenStorage, 'clear')
      .and
      .returnValue(null);

    tokenService.set(simpleToken).subscribe(noop);

    tokenService.clear().subscribe(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('token should be published', (done) => {
    tokenService.tokenChange()
      .pipe(take(1))
      .subscribe((token: FlexAuthToken) => {
        expect(token.getValue()).toEqual('');
      });
    tokenService.set(simpleToken).subscribe(noop);
    tokenService.tokenChange()
      .subscribe((token: FlexAuthToken) => {
        expect(token.getValue()).toEqual(simpleToken.getValue());
        done();
      });
  });

  it('clear should be published', (done) => {
    tokenService.tokenChange()
      .pipe(take(1))
      .subscribe((token: FlexAuthToken) => {
        expect(token.getValue()).toEqual('');
      });
    tokenService.set(simpleToken).subscribe(noop);
    tokenService.tokenChange()
      .pipe(take(1))
      .subscribe((token: FlexAuthToken) => {
        expect(token.getValue()).toEqual(simpleToken.getValue());
      });
    tokenService.clear().subscribe(noop);
    tokenService.tokenChange()
      .subscribe((token: FlexAuthToken) => {
        expect(token.getValue()).toEqual('');
        done();
      });
  });
});
