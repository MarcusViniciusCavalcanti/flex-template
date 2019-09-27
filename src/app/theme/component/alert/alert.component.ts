import { Component, Input, HostBinding, Output, EventEmitter } from '@angular/core';

import { FlexComponentSize } from '../component-size';
import { FlexComponentStatus } from '../component-status';
import { convertToBoolProperty } from '../helpers';

@Component({
  selector: 'app-flex-alert',
  styleUrls: ['./alert.component.scss'],
  template: `
    <button *ngIf="closable" type="button" class="close" aria-label="Close" (click)="onClose()">
      <span aria-hidden="true">&times;</span>
    </button>
    <ng-content></ng-content>
  `,
})
export class FlexAlertComponent {

  @Input() size: '' | FlexComponentSize = '';

  @Input() status: '' | FlexComponentStatus = '';

  @Input() accent: '' | FlexComponentStatus = '';

  @Input() outline: '' | FlexComponentStatus = '';

  @Output() close = new EventEmitter();

  @Input()
  @HostBinding('class.closable')
  get closable(): boolean {
    return this.isClose;
  }
  set closable(value: boolean) {
    this.isClose = convertToBoolProperty(value);
  }

  protected isClose = false;

  onClose() {
    this.close.emit();
  }

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

  @HostBinding('class.status-success')
  get success() {
    return this.status === 'success';
  }

  @HostBinding('class.status-info')
  get info() {
    return this.status === 'info';
  }

  @HostBinding('class.status-warning')
  get warning() {
    return this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger() {
    return this.status === 'danger';
  }

  @HostBinding('class.accent-primary')
  get primaryAccent() {
    return this.accent === 'primary';
  }

  @HostBinding('class.accent-success')
  get successAccent() {
    return this.accent === 'success';
  }

  @HostBinding('class.accent-info')
  get infoAccent() {
    return this.accent === 'info';
  }

  @HostBinding('class.accent-warning')
  get warningAccent() {
    return this.accent === 'warning';
  }

  @HostBinding('class.accent-danger')
  get dangerAccent() {
    return this.accent === 'danger';
  }

  @HostBinding('class.outline-primary')
  get primaryOutline() {
    return this.outline === 'primary';
  }

  @HostBinding('class.outline-success')
  get successOutline() {
    return this.outline === 'success';
  }

  @HostBinding('class.outline-info')
  get infoOutline() {
    return this.outline === 'info';
  }

  @HostBinding('class.outline-warning')
  get warningOutline() {
    return this.outline === 'warning';
  }

  @HostBinding('class.outline-danger')
  get dangerOutline() {
    return this.outline === 'danger';
  }
}
