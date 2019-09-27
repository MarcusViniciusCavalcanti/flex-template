import { Component, Input, HostBinding, forwardRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FlexComponentStatus } from '../component-status';
import { convertToBoolProperty } from '../helpers';

@Component({
  selector: 'app-flex-checkbox',
  template: `
    <label class="label">
      <input type="checkbox" class="native-input visually-hidden"
             [disabled]="disabled"
             [checked]="checked"
             (change)="updateValueAndIndeterminate($event)"
             (blur)="setTouched()"
             (click)="$event.stopPropagation()"
             [indeterminate]="indeterminate">
      <span [class.indeterminate]="indeterminate" [class.checked]="checked" class="custom-checkbox">
        <app-flex-icon *ngIf="indeterminate" icon="minus-bold-outline" pack="nebular-essentials"></app-flex-icon>
        <app-flex-icon *ngIf="checked && !indeterminate" icon="checkmark-bold-outline" pack="nebular-essentials"></app-flex-icon>
      </span>
      <span class="text">
        <ng-content></ng-content>
      </span>
    </label>
  `,
  styleUrls: [ `./checkbox.component.scss` ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FlexCheckboxComponent),
    multi: true,
  }],
})
export class FlexCheckboxComponent implements ControlValueAccessor {

  // tslint:disable-next-line:variable-name
  private _checked = false;

  // tslint:disable-next-line:variable-name
  private _disabled = false;

  // tslint:disable-next-line:variable-name
  private _indeterminate = false;

  onChange: any = () => { };

  onTouched: any = () => { };
  @Input()
  get value(): boolean {
    return this.checked;
  }
  set value(value: boolean) {
    console.warn('Checkbox: `value` is deprecated and will be removed in 5.0.0. Use `checked` instead.');
    this.checked = value;
  }

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = value;
  }
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = convertToBoolProperty(value);
  }


  @Input()
  status: '' | FlexComponentStatus = '';
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    this._indeterminate = convertToBoolProperty(value);
  }

  /**
   * Output when checked state is changed by a user
   * @deprecated
   * @breaking-change Remove @5.0.0
   * @type EventEmitter<boolean>
   */
  @Output()
  get valueChange(): EventEmitter<boolean> {
    console.warn('NbCheckbox: `valueChange` is deprecated and will be removed in 5.0.0. Use `checkedChange` instead.');
    return this.checkedChange;
  }
  set valueChange(valueChange: EventEmitter<boolean>) {
    this.checkedChange = valueChange;
  }

  @Output() checkedChange = new EventEmitter<boolean>();

  @HostBinding('class.status-primary')
  get primary() {
    return this.status === 'primary';
  }

  @HostBinding('class.status-success')
  get success() {
    return this.status === 'success';
  }

  @HostBinding('class.status-warning')
  get warning() {
    return this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger() {
    return this.status === 'danger';
  }

  @HostBinding('class.status-info')
  get info() {
    return this.status === 'info';
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(val: any) {
    this._checked = val;
    this.changeDetector.detectChanges();
  }

  setDisabledState(val: boolean) {
    this.disabled = convertToBoolProperty(val);
  }

  setTouched() {
    this.onTouched();
  }

  updateValueAndIndeterminate(event: Event): void {
    const input = (event.target as HTMLInputElement);
    this.checked = input.checked;
    this.checkedChange.emit(this.checked);
    this.onChange(this.checked);
    this.indeterminate = input.indeterminate;
  }
}
