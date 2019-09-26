import { NgModule, ModuleWithProviders } from '@angular/core';

import { FlexSharedModule } from '../shared/shared.module';

import {
  FlexSidebarComponent,
  FlexSidebarFooterComponent,
  FlexSidebarHeaderComponent,
} from './sidebar.component';

import { FlexSidebarService } from './sidebar.service';

const SIDEBAR_COMPONENTS = [
  FlexSidebarComponent,
  FlexSidebarFooterComponent,
  FlexSidebarHeaderComponent,
];

const SIDEBAR_PROVIDERS = [
  FlexSidebarService,
];

@NgModule({
  imports: [
    FlexSharedModule,
  ],
  declarations: [
    ...SIDEBAR_COMPONENTS,
  ],
  exports: [
    ...SIDEBAR_COMPONENTS,
  ],
})
export class FlexSidebarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexSidebarModule,
      providers: [
        ...SIDEBAR_PROVIDERS,
      ],
    } as ModuleWithProviders;
  }
}
