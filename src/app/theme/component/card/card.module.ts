import { NgModule } from '@angular/core';

import { FlexSharedModule } from '../shared/shared.module';
import { FlexIconModule } from '../icon/icon.module';
import {
  FlexCardComponent,
  FlexCardBodyComponent,
  FlexCardFooterComponent,
  FlexCardHeaderComponent,
} from './card.component';

import { FlexRevealCardComponent } from './reveal-card/reveal-card.component';
import { FlexFlipCardComponent } from './flip-card/flip-card.component';
import { FlexCardFrontComponent, FlexCardBackComponent } from './shared/shared.component';

const CARD_COMPONENTS = [
  FlexCardComponent,
  FlexCardBodyComponent,
  FlexCardFooterComponent,
  FlexCardHeaderComponent,
  FlexRevealCardComponent,
  FlexFlipCardComponent,
  FlexCardFrontComponent,
  FlexCardBackComponent,
];

@NgModule({
  imports: [
    FlexSharedModule,
    FlexIconModule,
  ],
  declarations: [
    ...CARD_COMPONENTS,
  ],
  exports: [
    ...CARD_COMPONENTS,
  ],
})
export class FlexCardModule { }
