import { Inject, Injectable, InjectionToken } from '@angular/core';

import { authCreateToken, FlexAuthToken, FlexAuthTokenClass } from './token';
import { FLEX_AUTH_TOKENS } from '../../auth.options';

export interface FlexTokenPack {
  name: string;
  ownerStrategyName: string;
  createdAt: Number;
  value: string;
}

export const FLEX_AUTH_FALLBACK_TOKEN = new InjectionToken<FlexAuthTokenClass>('Auth Options');

@Injectable()
export class FlexAuthTokenParceler {

  constructor(@Inject(FLEX_AUTH_FALLBACK_TOKEN) private fallbackClass: FlexAuthTokenClass,
              @Inject(FLEX_AUTH_TOKENS) private tokenClasses: FlexAuthTokenClass[]) {
  }

  wrap(token: FlexAuthToken): string {
    return JSON.stringify({
      name: token.getName(),
      ownerStrategyName: token.getOwnerStrategyName(),
      createdAt: token.getCreatedAt().getTime(),
      value: token.toString(),
    });
  }

  unwrap(value: string): FlexAuthToken {
    let tokenClass: FlexAuthTokenClass = this.fallbackClass;
    let tokenValue = '';
    let tokenOwnerStrategyName = '';
    let tokenCreatedAt: Date = null;

    const tokenPack: FlexTokenPack = this.parseTokenPack(value);
    if (tokenPack) {
      tokenClass = this.getClassByName(tokenPack.name) || this.fallbackClass;
      tokenValue = tokenPack.value;
      tokenOwnerStrategyName = tokenPack.ownerStrategyName;
      tokenCreatedAt = new Date(Number(tokenPack.createdAt));
    }

    return authCreateToken(tokenClass, tokenValue, tokenOwnerStrategyName, tokenCreatedAt);

  }

  protected getClassByName(name): FlexAuthTokenClass {
    return this.tokenClasses.find((tokenClass: FlexAuthTokenClass) => tokenClass.NAME === name);
  }

  protected parseTokenPack(value): FlexTokenPack {
    try {
      return JSON.parse(value);
    } catch (e) { }
    return null;
  }
}
