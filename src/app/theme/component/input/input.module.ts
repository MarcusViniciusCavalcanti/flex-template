import { NgModule } from '@angular/core';
import { FlexSharedModule } from '../shared/shared.module';
import { FlexInputDirective } from './input.directive';

@NgModule({
  imports: [ FlexSharedModule ],
  declarations: [ FlexInputDirective ],
  exports: [ FlexInputDirective ]
})
export class FlexInputModule {}
