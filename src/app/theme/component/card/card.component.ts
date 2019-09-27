import { Component, Input, HostBinding } from '@angular/core';

import { FlexComponentSize } from '../component-size';
import { FlexComponentStatus } from '../component-status';

@Component({
  selector: 'app-flex-card-header',
  template: `<ng-content></ng-content>`,
})
export class FlexCardHeaderComponent {
}

@Component({
  selector: 'app-flex-card-body',
  template: `<ng-content></ng-content>`,
})
export class FlexCardBodyComponent {
}

@Component({
  selector: 'app-flex-card-footer',
  template: `<ng-content></ng-content>`,
})
export class FlexCardFooterComponent {
}

@Component({
  selector: 'app-flex-card',
  styleUrls: ['./card.component.scss'],
  template: `
    <ng-content select="app-flex-card-header"></ng-content>
    <ng-content select="app-flex-card-body"></ng-content>
    <ng-content></ng-content>
    <ng-content select="app-flex-card-footer"></ng-content>
  `,
})
export class FlexCardComponent {

  @Input()
  get size(): '' | FlexComponentSize {
    return this._size;
  }
  set size(value: '' | FlexComponentSize) {
    this._size = value;
  }

  // tslint:disable-next-line:variable-name
  _size: '' | FlexComponentSize = '';

  /**
   * Card status:
   * primary, info, success, warning, danger
   */
  @Input()
  get status(): '' | FlexComponentStatus {
    return this._status;
  }
  set status(value: '' | FlexComponentStatus) {
    this._status = value;
  }
  // tslint:disable-next-line:variable-name
  _status: '' | FlexComponentStatus = '';

  @Input()
  get accent(): '' | FlexComponentStatus {
    return this._accent;
  }
  set accent(value: '' | FlexComponentStatus) {
    this._accent = value;
  }
  // tslint:disable-next-line:variable-name
  _accent: '' | FlexComponentStatus;

  @HostBinding('class.size-tiny')
  get tiny() {
    return this.size === 'tiny';
  }

  @HostBinding('class.size-small')
  get small() {
    return this.size === 'small';
  }

  @HostBinding('class.size-medium')
  get medium() {
    return this.size === 'medium';
  }

  @HostBinding('class.size-large')
  get large() {
    return this.size === 'large';
  }

  @HostBinding('class.size-giant')
  get giant() {
    return this.size === 'giant';
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

  @HostBinding('class.accent')
  get hasAccent() {
    return this.accent;
  }

  @HostBinding('class.accent-primary')
  get primaryAccent() {
    return this.accent === 'primary';
  }

  @HostBinding('class.accent-info')
  get infoAccent() {
    return this.accent === 'info';
  }

  @HostBinding('class.accent-success')
  get successAccent() {
    return this.accent === 'success';
  }

  @HostBinding('class.accent-warning')
  get warningAccent() {
    return this.accent === 'warning';
  }

  @HostBinding('class.accent-danger')
  get dangerAccent() {
    return this.accent === 'danger';
  }
}
