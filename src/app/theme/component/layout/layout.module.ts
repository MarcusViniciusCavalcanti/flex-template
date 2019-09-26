import { NgModule } from '@angular/core';

import { FlexSharedModule } from '../shared/shared.module';

import {
  FlexLayoutComponent,
  FlexLayoutColumnComponent,
  FlexLayoutFooterComponent,
  FlexLayoutHeaderComponent,
} from './layout.component';

import { FlexRestoreScrollTopHelper } from './restore-scroll-top.service';

const LAYOUT_COMPONENTS = [
  FlexLayoutComponent,
  FlexLayoutColumnComponent,
  FlexLayoutFooterComponent,
  FlexLayoutHeaderComponent,
];

@NgModule({
  imports: [
    FlexSharedModule,
  ],
  declarations: [
    ...LAYOUT_COMPONENTS,
  ],
  providers: [
    FlexRestoreScrollTopHelper,
  ],
  exports: [
    ...LAYOUT_COMPONENTS,
  ],
})
export class FlexLayoutModule { }
