import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';

import { FlexAuthService } from './services/auth.service';
import { FlexAuthSimpleToken, FlexAuthTokenClass } from './services/token/token';
import { FlexTokenLocalStorage, FlexTokenStorage } from './services/token/token-storage';
import { FlexTokenService } from './services/token/token.service';
import { FlexAuthTokenParceler, FLEX_AUTH_FALLBACK_TOKEN } from './services/token/token-parceler';
import { FlexAuthStrategy } from './strategies/auth-strategy';
import { FlexAuthStrategyOptions } from './strategies/auth-strategy-options';
import { FlexDummyAuthStrategy } from './strategies/dummy/dummy-strategy';
import { FlexPasswordAuthStrategy } from './strategies/password/password-strategy';

import {
  defaultAuthOptions,
  FLEX_AUTH_INTERCEPTOR_HEADER,
  FLEX_AUTH_OPTIONS,
  FLEX_AUTH_STRATEGIES,
  FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER,
  FLEX_AUTH_TOKENS,
  FLEX_AUTH_USER_OPTIONS,
  FlexAuthOptions,
  FlexAuthStrategyClass,
} from './auth.options';


import { deepExtend } from './helpers';

// Module Theme
import { FlexIconModule } from '../../theme/component/icon/icon.module';
import { FlexLayoutModule } from '../../theme/component/layout/layout.module';
import { FlexCardModule } from '../../theme/component/card/card.module';
import { FlexCheckboxModule } from '../../theme/component/checkbox/checkbox.module';
import { FlexInputModule } from '../../theme/component/input/input.module';
import { FlexAlertModule } from '../../theme/component/alert/alert.module';
import { FlexButtonModule } from '../../theme/component/button/button.module';

// components
import { FlexAuthBlockComponent } from './components/auth-block/auth-block.component';
import { FlexLoginComponent } from './components/login/login.component';
import { FlexRegisterComponent } from './components/register/register.component';
import { FlexRequestPasswordComponent } from './components/request-password/request-password.component';
import { FlexResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FlexAuthComponent } from './components/auth.component';
import { FlexLogoutComponent } from './components/logout/logout.component';

export function strategiesFactory(options: FlexAuthOptions, injector: Injector): FlexAuthStrategy[] {
  const strategies = [];
  options.strategies
    .forEach(([strategyClass, strategyOptions]: [FlexAuthStrategyClass, FlexAuthStrategyOptions]) => {
      const strategy: FlexAuthStrategy = injector.get(strategyClass);
      strategy.setOptions(strategyOptions);

      strategies.push(strategy);
    });
  return strategies;
}

export function nbTokensFactory(strategies: FlexAuthStrategy[]): FlexAuthTokenClass[] {
  const tokens = [];
  strategies
    .forEach((strategy: FlexAuthStrategy) => {
      tokens.push(strategy.getOption('token.class'));
    });
  return tokens;
}

export function optionsFactory(options) {
  return deepExtend(defaultAuthOptions, options);
}

export function nbNoOpInterceptorFilter(req: HttpRequest<any>): boolean {
  return true;
}

const AUTH_COMPONENTS = [
  FlexAuthBlockComponent,
  FlexLoginComponent,
  FlexLogoutComponent,
  FlexRegisterComponent,
  FlexRequestPasswordComponent,
  FlexResetPasswordComponent,
  FlexAuthComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FlexCardModule,
    FlexCheckboxModule,
    FlexAlertModule,
    FlexInputModule,
    FlexButtonModule,
    RouterModule,
    FormsModule,
    FlexIconModule,
  ],
  declarations: [
    ...AUTH_COMPONENTS
  ],
  exports: [
    ...AUTH_COMPONENTS
  ],
})
export class FlexAuthModule {
  static forRoot(nbAuthOptions?: FlexAuthOptions): ModuleWithProviders {
    return {
      ngModule: FlexAuthModule,
      providers: [
        { provide: FLEX_AUTH_USER_OPTIONS, useValue: nbAuthOptions },
        { provide: FLEX_AUTH_OPTIONS, useFactory: optionsFactory, deps: [FLEX_AUTH_USER_OPTIONS] },
        { provide: FLEX_AUTH_STRATEGIES, useFactory: strategiesFactory, deps: [FLEX_AUTH_OPTIONS, Injector] },
        { provide: FLEX_AUTH_TOKENS, useFactory: nbTokensFactory, deps: [FLEX_AUTH_STRATEGIES] },
        { provide: FLEX_AUTH_FALLBACK_TOKEN, useValue: FlexAuthSimpleToken },
        { provide: FLEX_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
        { provide: FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: nbNoOpInterceptorFilter },
        { provide: FlexTokenStorage, useClass: FlexTokenLocalStorage },
        FlexAuthTokenParceler,
        FlexAuthService,
        FlexTokenService,
        FlexDummyAuthStrategy,
        FlexPasswordAuthStrategy,
      ],
    } as ModuleWithProviders;
  }
}
