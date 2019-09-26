import { NgModule } from '@angular/core';
import { BidiModule, Directionality } from '@angular/cdk/bidi';
import { FlexDirectionality } from './bidi-service';

@NgModule({
  providers: [
    { provide: FlexDirectionality, useExisting: Directionality },
  ],
})
export class FlexBidiModule extends BidiModule {}
