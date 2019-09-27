import { NgModule } from '@angular/core';

import { FlexSharedModule } from '../shared/shared.module';
import { FlexIconModule } from '../icon/icon.module';
import { FlexCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [
    FlexSharedModule,
    FlexIconModule,
  ],
  declarations: [FlexCheckboxComponent],
  exports: [FlexCheckboxComponent],
})
export class FlexCheckboxModule { }
