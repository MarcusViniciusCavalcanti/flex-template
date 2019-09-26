import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LayoutService } from './tools/layout.service';


export const CORE_PROVIDERS = [
  LayoutService
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [ ...CORE_PROVIDERS ],
    } as ModuleWithProviders;
  }
}
