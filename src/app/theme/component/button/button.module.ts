import { NgModule } from '@angular/core';
import { FlexSharedModule } from '../shared/shared.module';
import { FlexButtonComponent } from './button.component';

@NgModule({
  imports: [
    FlexSharedModule,
  ],
  declarations: [
    FlexButtonComponent
  ],
  exports: [
    FlexButtonComponent
  ],
})
export class FlexButtonModule { }
