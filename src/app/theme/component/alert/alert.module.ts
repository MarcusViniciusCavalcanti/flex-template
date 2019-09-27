import { NgModule } from '@angular/core';

import { FlexSharedModule } from '../shared/shared.module';

import { FlexAlertComponent } from './alert.component';

@NgModule({
  imports: [
    FlexSharedModule,
  ],
  declarations: [
    FlexAlertComponent,
  ],
  exports: [
    FlexAlertComponent,
  ],
})
export class NbAlertModule {
}
