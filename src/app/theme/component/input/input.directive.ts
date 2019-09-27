import { Directive, Input, HostBinding } from '@angular/core';

import { convertToBoolProperty } from '../helpers';
import { FlexComponentSize } from '../component-size';
import { FlexComponentShape } from '../component-shape';
import { FlexComponentStatus } from '../component-status';


@Directive({
  selector: 'input[appInput],textarea[appInput]',
})
export class FlexInputDirective {

  // tslint:disable-next-line:variable-name
  private _fullWidth = false;

  @Input()
  fieldSize: FlexComponentSize = 'medium';

  @Input()
  status: '' | FlexComponentStatus = '';

  @Input()
  shape: FlexComponentShape = 'rectangle';
  @Input()
  @HostBinding('class.input-full-width')
  get fullWidth(): boolean {
    return this._fullWidth;
  }
  set fullWidth(value: boolean) {
    this._fullWidth = convertToBoolProperty(value);
  }

  @HostBinding('class.size-tiny')
  get tiny() {
    return this.fieldSize === 'tiny';
  }

  @HostBinding('class.size-small')
  get small() {
    return this.fieldSize === 'small';
  }

  @HostBinding('class.size-medium')
  get medium() {
    return this.fieldSize === 'medium';
  }

  @HostBinding('class.size-large')
  get large() {
    return this.fieldSize === 'large';
  }

  @HostBinding('class.size-giant')
  get giant() {
    return this.fieldSize === 'giant';
  }

  @HostBinding('class.status-primary')
  get primary() {
    return this.status === 'primary';
  }

  @HostBinding('class.status-info')
  get info() {
    return this.status === 'info';
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

  @HostBinding('class.shape-rectangle')
  get rectangle() {
    return this.shape === 'rectangle';
  }

  @HostBinding('class.shape-semi-round')
  get semiRound() {
    return this.shape === 'semi-round';
  }

  @HostBinding('class.shape-round')
  get round() {
    return this.shape === 'round';
  }
}
