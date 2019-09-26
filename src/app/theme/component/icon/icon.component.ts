import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FlexComponentStatus } from '../component-status';
import { FlexIconLibraries } from './icon-libraries';

export interface FlexIconConfig {
  icon: string;
  pack?: string;
  status?: FlexComponentStatus;
  options?: { [name: string]: any };
}

@Component({
  selector: 'app-flex-icon',
  styleUrls: [`./icon.component.scss`],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexIconComponent implements FlexIconConfig, OnChanges, OnInit {

  protected iconDef;

  protected prevClasses = [];

  protected iconConfig: string | FlexIconConfig;

  @HostBinding('innerHtml')
  html: SafeHtml;

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

  @Input() icon: string;

  @Input() pack: string;

  @Input() options: { [name: string]: any };

  @Input() status: FlexComponentStatus;
  @Input()
  get config(): string | FlexIconConfig {
    return this.iconConfig;
  }
  set config(value: string | FlexIconConfig) {
    if (!value) {
      return;
    }

    this.iconConfig = value;

    if (typeof value === 'string') {
      this.icon = value;
    } else {
      this.icon = value.icon;
      this.pack = value.pack;
      this.status = value.status;
      this.options = value.options;
    }
  }

  constructor(
    protected sanitizer: DomSanitizer,
    protected iconLibrary: FlexIconLibraries,
    protected el: ElementRef,
    protected renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.iconDef = this.renderIcon(this.icon, this.pack, this.options);
  }

  ngOnChanges() {
    if (this.iconDef) {
      this.iconDef = this.renderIcon(this.icon, this.pack, this.options);
    }
  }

  renderIcon(name: string, pack?: string, options?: { [name: string]: any }) {
    const iconDefinition = this.iconLibrary.getIcon(name, pack);

    const content = iconDefinition.icon.getContent(options);
    if (content) {
      this.html = this.sanitizer.bypassSecurityTrustHtml(content);
    }

    this.assignClasses(iconDefinition.icon.getClasses(options));
    return iconDefinition;
  }

  protected assignClasses(classes: string[]) {
    this.prevClasses.forEach((className: string) => {
      this.renderer.removeClass(this.el.nativeElement, className);
    });

    classes.forEach((className: string) => {
      this.renderer.addClass(this.el.nativeElement, className);
    });

    this.prevClasses = classes;
  }
}
