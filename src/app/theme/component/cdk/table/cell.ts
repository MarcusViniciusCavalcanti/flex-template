import { Directive, ElementRef, HostBinding, InjectionToken, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

@Directive({
  selector: '[appCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: FlexCellDefDirective }],
})
export class FlexCellDefDirective extends CdkCellDef {
}

@Directive({
  selector: '[appHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: FlexHeaderCellDefDirective }],
})
export class FlexHeaderCellDefDirective extends CdkHeaderCellDef {
}

@Directive({
  selector: '[appFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: FlexFooterCellDefDirective }],
})
export class FlexFooterCellDefDirective extends CdkFooterCellDef {
}

export const FLEX_SORT_HEADER_COLUMN_DEF = new InjectionToken('FLEX_SORT_HEADER_COLUMN_DEF');

@Directive({
  selector: '[appColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: FlexColumnDefDirective },
    { provide: FLEX_SORT_HEADER_COLUMN_DEF, useExisting: FlexColumnDefDirective },
  ],
})
export class FlexColumnDefDirective extends CdkColumnDef {
  @Input('appColumnDef') name: string;

  @Input() sticky: boolean;

  @Input() stickyEnd: boolean;
}

// TODO: resolver => hostbinding
@Directive({
  selector: 'app-flex-header-cell, th[appHeaderCell]',
  host: {
    class: 'app-flex-header-cell',
    role: 'columnheader',
  },
})
export class FlexHeaderCellDirective extends CdkHeaderCell {


  constructor(columnDef: FlexColumnDefDirective,
              elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`nb-column-${columnDef.cssClassFriendlyName}`);
  }
}

// TODO resolver
@Directive({
  selector: 'app-flex-footer-cell, td[appFooterCell]',
  host: {
    class: 'app-flex-footer-cell',
    role: 'gridcell',
  },
})
export class FlexFooterCellDirective extends CdkFooterCell {
  constructor(columnDef: FlexColumnDefDirective,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`nb-column-${columnDef.cssClassFriendlyName}`);
  }
}

// TODO resolver
@Directive({
  selector: 'app-flex-cell, td[appCell]',
  host: {
    class: 'app-flex-cell',
    role: 'gridcell',
  },
})
export class FlexCellDirective extends CdkCell {
  constructor(columnDef: FlexColumnDefDirective,
              elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`nb-column-${columnDef.cssClassFriendlyName}`);
  }
}
