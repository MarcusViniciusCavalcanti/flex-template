import { async, inject, TestBed } from '@angular/core/testing';

import { FlexTokenLocalStorage, FlexTokenStorage } from './token-storage';
import { FLEX_AUTH_TOKENS } from '../../auth.options';
import { FlexAuthSimpleToken, authCreateToken, FlexAuthJWTToken } from './token';
import { FLEX_AUTH_FALLBACK_TOKEN, FlexAuthTokenParceler } from './token-parceler';

describe('token-storage', () => {

  let tokenStorage: FlexTokenStorage;
  let tokenParceler: FlexAuthTokenParceler;
  const testTokenKey = 'auth_app_token';
  const testTokenValue = 'test-token';
  const ownerStrategyName = 'strategy';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FlexTokenStorage, useClass: FlexTokenLocalStorage },
        { provide: FLEX_AUTH_FALLBACK_TOKEN, useValue: FlexAuthSimpleToken },
        { provide: FLEX_AUTH_TOKENS, useValue: [FlexAuthSimpleToken, FlexAuthJWTToken] },
        FlexAuthTokenParceler,
      ],
    });
  });

    beforeEach(async(inject(
    [FlexTokenStorage, FlexAuthTokenParceler],
    (_tokenStorage, _tokenParceler) => {
      tokenStorage = _tokenStorage;
      tokenParceler = _tokenParceler;
    },
  )));

  afterEach(() => {
    localStorage.removeItem(testTokenKey);
  });


  it('set test token', () => {
    const token = authCreateToken(FlexAuthSimpleToken, testTokenValue, ownerStrategyName);

    tokenStorage.set(token);
    expect(localStorage.getItem(testTokenKey)).toEqual(tokenParceler.wrap(token));
  });

  it('setter set invalid token to localStorage as empty string', () => {
    let token;

    token = authCreateToken(FlexAuthSimpleToken, null, ownerStrategyName);
    tokenStorage.set(token);
    expect(localStorage.getItem(testTokenKey)).toEqual(tokenParceler.wrap(token));

    token = authCreateToken(FlexAuthSimpleToken, undefined, ownerStrategyName);
    tokenStorage.set(token);
    expect(localStorage.getItem(testTokenKey)).toEqual(tokenParceler.wrap(token));
  });

  it('get return null in case token was not set', () => {
    const token = tokenStorage.get();
    expect(token.getValue()).toBe('');
    expect(token.isValid()).toBe(false);
  });

  it('should return correct value', () => {
    const token = authCreateToken(FlexAuthSimpleToken, 'test', ownerStrategyName);
    localStorage.setItem(testTokenKey, tokenParceler.wrap(token));

    expect(tokenStorage.get().getValue()).toEqual(token.getValue());
  });

  it('clear remove token', () => {
    const token = authCreateToken(FlexAuthSimpleToken, 'test', ownerStrategyName);
    localStorage.setItem(testTokenKey, tokenParceler.wrap(token));

    tokenStorage.clear();

    expect(localStorage.getItem(testTokenKey)).toBeNull();
  });

  it('clear remove token only', () => {
    const token = authCreateToken(FlexAuthSimpleToken, 'test', ownerStrategyName);
    localStorage.setItem(testTokenKey, tokenParceler.wrap(token));
    localStorage.setItem(testTokenKey + '2', tokenParceler.wrap(token));

    tokenStorage.clear();

    expect(localStorage.getItem(testTokenKey + '2')).toEqual(tokenParceler.wrap(token));
    expect(localStorage.getItem(testTokenKey)).toBeNull();
  });
});
