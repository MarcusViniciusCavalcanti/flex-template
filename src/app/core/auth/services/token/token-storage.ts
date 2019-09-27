import { Injectable } from '@angular/core';

import { FlexAuthToken } from './token';
import { FlexAuthTokenParceler } from './token-parceler';

export abstract class FlexTokenStorage {

  abstract get(): FlexAuthToken;
  abstract set(token: FlexAuthToken);
  abstract clear();
}

@Injectable()
export class FlexTokenLocalStorage extends FlexTokenStorage {

  protected key = 'auth_app_token';

  constructor(private parceler: FlexAuthTokenParceler) {
    super();
  }

  get(): FlexAuthToken {
    const raw = localStorage.getItem(this.key);
    return this.parceler.unwrap(raw);
  }

  set(token: FlexAuthToken) {
    const raw = this.parceler.wrap(token);
    localStorage.setItem(this.key, raw);
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
