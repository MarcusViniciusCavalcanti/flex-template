import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkCellOutlet,
  DataRowOutlet,
  HeaderRowOutlet,
  FooterRowOutlet,
} from '@angular/cdk/table';

@Directive({
  selector: '[appRowOutlet]',
  providers: [{ provide: DataRowOutlet, useExisting: FlexDataRowOutletDirective }],
})
export class FlexDataRowOutletDirective extends DataRowOutlet {}

@Directive({
  selector: '[appHeaderRowOutlet]',
  providers: [{ provide: HeaderRowOutlet, useExisting: FlexHeaderRowOutletDirective }],
})
export class FlexHeaderRowOutletDirective extends HeaderRowOutlet {}

@Directive({
  selector: '[appFooterRowOutlet]',
  providers: [{ provide: FooterRowOutlet, useExisting: FlexFooterRowOutletDirective }],
})
export class FlexFooterRowOutletDirective extends FooterRowOutlet {}

@Directive({
  selector: '[appCellOutlet]',
  providers: [{ provide: CdkCellOutlet, useExisting: FlexCellOutletDirective }],
})
export class FlexCellOutletDirective extends CdkCellOutlet {}

@Directive({
  selector: '[appHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: FlexHeaderRowDefDirective }],
})
export class FlexHeaderRowDefDirective extends CdkHeaderRowDef {

  @Input('flexHeaderRowDef') columns: Iterable<string>;

  @Input('flexHeaderRowDefSticky') sticky: boolean;
}

@Directive({
  selector: '[appFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: FlexFooterRowDefDirective }],
})
export class FlexFooterRowDefDirective extends CdkFooterRowDef {

  @Input('flexFooterRowDef') columns: Iterable<string>;

  @Input('flexFooterRowDefSticky') sticky: boolean;
}

@Directive({
  selector: '[appRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: FlexRowDefDirective }],
})
export class FlexRowDefDirective<T> extends CdkRowDef<T> {
  @Input('flexRowDefColumns') columns: Iterable<string>;

  @Input('flexRowDefWhen') when: (index: number, rowData: T) => boolean;
}

// TODO verificar
@Component({
  selector: 'app-flex-header-row, tr[appHeaderRow]',
  template: `
    <ng-container appCellOutlet></ng-container>`,
  host: {
    'class': 'app-flex-header-row',
    'role': 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkHeaderRow, useExisting: FlexHeaderRowComponent }],
})
export class FlexHeaderRowComponent extends CdkHeaderRow {
}

// todo: seperar?
@Component({
  selector: 'app-flex-footer-row, tr[appFooterRow]',
  template: `
    <ng-container appCellOutlet></ng-container>`,
  host: {
    'class': 'app-flex-footer-row',
    'role': 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkFooterRow, useExisting: FlexFooterRowComponent }],
})
export class FlexFooterRowComponent extends CdkFooterRow {
}

// todo: seperar?
@Component({
  selector: 'app-flex-row, tr[appRow]',
  template: `
    <ng-container appCellOutlet></ng-container>`,
  host: {
    'class': 'app-flex-row',
    'role': 'row',
  },
  providers: [{ provide: CdkRow, useExisting: FlexRowComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexRowComponent extends CdkRow {
}
