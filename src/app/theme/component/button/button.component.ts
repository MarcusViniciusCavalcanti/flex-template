import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

import { FlexComponentStatus } from '../component-status';
import { FlexComponentShape } from '../component-shape';
import { FlexComponentSize } from '../component-size';
import { convertToBoolProperty, firstChildNotComment, lastChildNotComment } from '../helpers';

export type FlexButtonAppearance = 'filled' | 'outline' | 'ghost' | 'hero';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[flexButton],a[flexButton],input[type="button"][flexButton],input[type="submit"][flexButton]',
  styleUrls: ['./button.component.scss'],
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexButtonComponent implements AfterViewInit {

  protected isInitialized = false;

  // tslint:disable-next-line:variable-name
  private _fullWidth = false;

  // tslint:disable-next-line:variable-name
  private _disabled = false;

  @Input() size: FlexComponentSize = 'medium';

  @Input() status: FlexComponentStatus = 'primary';

  @Input() shape: FlexComponentShape = 'rectangle';
  @Input() appearance: FlexButtonAppearance = 'filled';

  @Input()
  @HostBinding('class.appearance-filled')
  get filled(): boolean {
    return this.appearance === 'filled';
  }
  set filled(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'filled';
    }
  }

  @Input()
  @HostBinding('class.appearance-outline')
  get outline(): boolean {
    return this.appearance === 'outline';
  }
  set outline(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'outline';
    }
  }

  @Input()
  @HostBinding('class.appearance-ghost')
  get ghost(): boolean {
    return this.appearance === 'ghost';
  }
  set ghost(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'ghost';
    }
  }

  @Input()
  @HostBinding('class.appearance-hero')
  get hero(): boolean {
    return this.appearance === 'hero';
  }
  set hero(value: boolean) {
    if (convertToBoolProperty(value)) {
      this.appearance = 'hero';
    }
  }
  @Input()
  @HostBinding('class.full-width')
  get fullWidth(): boolean {
    return this._fullWidth;
  }

  set fullWidth(value: boolean) {
    this._fullWidth = convertToBoolProperty(value);
  }
  @Input()
  @HostBinding('attr.aria-disabled')
  @HostBinding('class.btn-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = convertToBoolProperty(value);
    this.renderer.setProperty(this.hostElement.nativeElement, 'disabled', this.disabled);
  }

  @HostBinding('attr.tabindex')
  get tabbable(): string {
    return this.disabled ? '-1' : '0';
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

  @HostBinding('class.shape-round')
  get round() {
    return this.shape === 'round';
  }

  @HostBinding('class.shape-semi-round')
  get semiRound() {
    return this.shape === 'semi-round';
  }

  @HostBinding('class.icon-start')
  get iconLeft(): boolean {
    const el = this.hostElement.nativeElement;
    const icon = this.iconElement;
    return !!(icon && firstChildNotComment(el) === icon);
  }

  @HostBinding('class.icon-end')
  get iconRight(): boolean {
    const el = this.hostElement.nativeElement;
    const icon = this.iconElement;
    return !!(icon && lastChildNotComment(el) === icon);
  }

  @HostBinding('class.transitions')
  get transitions(): boolean {
    return this.isInitialized;
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  constructor(
    protected renderer: Renderer2,
    protected hostElement: ElementRef<HTMLElement>,
    protected cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.isInitialized = true;
      this.cd.markForCheck();
    });
  }

  protected get iconElement() {
    const el = this.hostElement.nativeElement;
    return el.querySelector('app-flex-icon');
  }
}
