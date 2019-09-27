import { InjectionToken } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { FlexAuthStrategy } from './strategies/auth-strategy';
import { FlexAuthStrategyOptions } from './strategies/auth-strategy-options';
import { FlexAuthToken, FlexAuthTokenClass } from './services/token/token';

export type FlexAuthStrategyClass = new (...params: any[]) => FlexAuthStrategy;

export type FlexAuthStrategies  = [FlexAuthStrategyClass, FlexAuthStrategyOptions][];

export interface FlexAuthOptions {
  forms?: any;
  strategies?: FlexAuthStrategies;
}

export interface FlexAuthSocialLink {
  link?: string;
  url?: string;
  target?: string;
  title?: string;
  icon?: string;
}

const socialLinks: FlexAuthSocialLink[] = [];

export const defaultAuthOptions: any = {
  strategies: [],
  forms: {
    login: {
      redirectDelay: 500, // delay before redirect after a successful login, while success message is shown to the user
      strategy: 'email',  // provider id key. If you have multiple strategies, or what to use your own
      rememberMe: true,   // whether to show or not the `rememberMe` checkbox
      showMessages: {     // show/not show success/error messages
        success: true,
        error: true,
      },
      socialLinks, // social links at the bottom of a page
    },
    register: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      terms: true,
      socialLinks,
    },
    requestPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks,
    },
    resetPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks,
    },
    logout: {
      redirectDelay: 500,
      strategy: 'email',
    },
    validation: {
      password: {
        required: true,
        minLength: 4,
        maxLength: 50,
      },
      email: {
        required: true,
      },
      fullName: {
        required: false,
        minLength: 4,
        maxLength: 50,
      },
    },
  },
};

export const FLEX_AUTH_OPTIONS = new InjectionToken<FlexAuthOptions>('Auth Options');
export const FLEX_AUTH_USER_OPTIONS = new InjectionToken<FlexAuthOptions>('User Auth Options');
export const FLEX_AUTH_STRATEGIES = new InjectionToken<FlexAuthStrategies>('Auth Strategies');
export const FLEX_AUTH_TOKENS = new InjectionToken<FlexAuthTokenClass<FlexAuthToken>[]>('Auth Tokens');
export const FLEX_AUTH_INTERCEPTOR_HEADER = new InjectionToken<string>('Simple Interceptor Header');
export const FLEX_AUTH_TOKEN_INTERCEPTOR_FILTER = new InjectionToken<(req: HttpRequest<any>) => boolean>('Interceptor Filter');

