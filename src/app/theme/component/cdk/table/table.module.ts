import { Attribute, ChangeDetectorRef, ElementRef, Inject, IterableDiffers, NgModule } from '@angular/core';
import { CdkTable, CdkTableModule } from '@angular/cdk/table';
import { FlexBidiModule } from '../bidi/bidi.module';
import { FlexDirectionality } from '../bidi/bidi-service';
import { FlexPlatformModule } from '../platform/platform.module';
import { FlexPlatform } from '../platform/platform-service';
import { FLEX_DOCUMENT } from '../../../theme.options';
import {
  FlexCellDefDirective,
  FlexCellDirective,
  FlexColumnDefDirective,
  FlexFooterCellDefDirective,
  FlexFooterCellDirective,
  FlexHeaderCellDefDirective,
  FlexHeaderCellDirective,
} from './cell';
import {
  FlexCellOutletDirective,
  FlexDataRowOutletDirective,
  FlexFooterRowOutletDirective,
  FlexHeaderRowOutletDirective,
  FlexFooterRowComponent,
  FlexFooterRowDefDirective,
  FlexHeaderRowComponent,
  FlexHeaderRowDefDirective,
  FlexRowComponent,
  FlexRowDefDirective,
} from './row';

export const FLEX_TABLE_TEMPLATE = `
  <ng-container appHeaderRowOutlet></ng-container>
  <ng-container appRowOutlet></ng-container>
  <ng-container appFooterRowOutlet></ng-container>`;

export class FlexTable<T> extends CdkTable<T> {
  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string,
    dir: FlexDirectionality,
    @Inject(FLEX_DOCUMENT) document: any,
    platform: FlexPlatform | undefined,
  ) {
    super(differs, changeDetectorRef, elementRef, role, dir, document, platform);
  }
}

const COMPONENTS = [
  FlexTable,

  // Template defs
  FlexHeaderCellDefDirective,
  FlexHeaderRowDefDirective,
  FlexColumnDefDirective,
  FlexCellDefDirective,
  FlexRowDefDirective,
  FlexFooterCellDefDirective,
  FlexFooterRowDefDirective,

  // Outlets
  FlexDataRowOutletDirective,
  FlexHeaderRowOutletDirective,
  FlexFooterRowOutletDirective,
  FlexCellOutletDirective,

  // Cell directives
  FlexHeaderCellDirective,
  FlexCellDirective,
  FlexFooterCellDirective,

  // Row directives
  FlexHeaderRowComponent,
  FlexRowComponent,
  FlexFooterRowComponent,
];

// TODO resolver
@NgModule({
  imports: [ FlexBidiModule, FlexPlatformModule ],
  declarations: [ ...COMPONENTS ],
  exports: [ ...COMPONENTS ],
})
export class FlexTableModule extends CdkTableModule {}
