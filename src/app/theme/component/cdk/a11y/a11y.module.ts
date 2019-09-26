import { ModuleWithProviders, NgModule } from '@angular/core';

import { FlexFocusTrapFactoryService } from './flex-focus-trap-factory.service';
import { FlexFocusKeyManagerFactoryService } from './focus-key-manager-factory.service';

@NgModule({})
export class FlexA11yModule {
  static forRoot() {
    return {
      ngModule: FlexA11yModule,
      providers: [
        FlexFocusTrapFactoryService,
        FlexFocusKeyManagerFactoryService,
      ],
    } as ModuleWithProviders;
  }
}
