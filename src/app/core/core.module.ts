import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LayoutService } from './tools/layout.service';
import { FlexAuthModule } from './auth/auth.module';
import { FlexDummyAuthStrategy } from './auth/strategies/dummy/dummy-strategy';

export const CORE_PROVIDERS = [
  LayoutService
];

const SECURITY_PROVIDERS = [
  ...FlexAuthModule.forRoot({
    strategies: [
      FlexDummyAuthStrategy.setup({
        name: 'email',
        delay: 3000,
      }),
    ],
  }).providers,

  // ACL
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    FlexAuthModule,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [ ...CORE_PROVIDERS, ...SECURITY_PROVIDERS ],
    } as ModuleWithProviders;
  }
}
