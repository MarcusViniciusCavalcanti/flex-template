import { Component, HostBinding, Input, OnInit, OnDestroy, ElementRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { convertToBoolProperty } from '../helpers';
import { FlexThemeService } from '../../services/flex-theme.service';
import { FlexMediaBreakpoint } from '../../services/breakpoints/flex-breakpoints.service';
import { FlexSidebarService } from './sidebar.service';

@Component({
  selector: 'app-flex-sidebar-header',
  template: `
    <ng-content></ng-content>
  `,
})
export class FlexSidebarHeaderComponent {
}

@Component({
  selector: 'app-flex-sidebar-footer',
  template: `
    <ng-content></ng-content>
  `,
})
export class FlexSidebarFooterComponent {
}

@Component({
  selector: 'app-flex-sidebar',
  styleUrls: ['./sidebar.component.scss'],
  template: `
    <div class="main-container"
         [class.main-container-fixed]="containerFixedValue">
      <ng-content select="app-flex-sidebar-header"></ng-content>
      <div class="scrollable" (click)="onClick($event)">
        <ng-content></ng-content>
      </div>
      <ng-content select="app-flex-sidebar-footer"></ng-content>
    </div>
  `,
})
export class FlexSidebarComponent implements OnChanges, OnInit, OnDestroy {

  static readonly STATE_EXPANDED: string = 'expanded';
  static readonly STATE_COLLAPSED: string = 'collapsed';
  static readonly STATE_COMPACTED: string = 'compacted';

  static readonly RESPONSIVE_STATE_MOBILE: string = 'mobile';
  static readonly RESPONSIVE_STATE_TABLET: string = 'tablet';
  static readonly RESPONSIVE_STATE_PC: string = 'pc';

  protected stateValue: string;
  protected responsiveValue = false;

  private alive = true;

  containerFixedValue = true;

  @HostBinding('class.fixed') fixedValue = false;
  @HostBinding('class.right') rightValue = false;
  @HostBinding('class.left') leftValue = true;
  @HostBinding('class.start') startValue = false;
  @HostBinding('class.end') endValue = false;

  @HostBinding('class.expanded')
  get expanded() {
    return this.stateValue === FlexSidebarComponent.STATE_EXPANDED;
  }
  @HostBinding('class.collapsed')
  get collapsed() {
    return this.stateValue === FlexSidebarComponent.STATE_COLLAPSED;
  }
  @HostBinding('class.compacted')
  get compacted() {
    return this.stateValue === FlexSidebarComponent.STATE_COMPACTED;
  }

  @Input()
  set right(val: boolean) {
    this.rightValue = convertToBoolProperty(val);
    this.leftValue = !this.rightValue;
    this.startValue = false;
    this.endValue = false;
  }

  @Input()
  set left(val: boolean) {
    this.leftValue = convertToBoolProperty(val);
    this.rightValue = !this.leftValue;
    this.startValue = false;
    this.endValue = false;
  }

  @Input()
  set start(val: boolean) {
    this.startValue = convertToBoolProperty(val);
    this.endValue = !this.startValue;
    this.leftValue = false;
    this.rightValue = false;
  }

  @Input()
  set end(val: boolean) {
    this.endValue = convertToBoolProperty(val);
    this.startValue = !this.endValue;
    this.leftValue = false;
    this.rightValue = false;
  }

  @Input()
  set fixed(val: boolean) {
    this.fixedValue = convertToBoolProperty(val);
  }

  @Input()
  set containerFixed(val: boolean) {
    this.containerFixedValue = convertToBoolProperty(val);
  }

  @Input()
  set state(val: string) {
    this.stateValue = val;
  }

  @Input()
  set responsive(val: boolean) {
    this.responsiveValue = convertToBoolProperty(val);
  }

  @Input() tag: string;

  @Input() compactedBreakpoints: string[] = ['xs', 'is', 'sm', 'md', 'lg'];

  @Input() collapsedBreakpoints: string[] = ['xs', 'is'];

  private mediaQuerySubscription: Subscription;
  private responsiveState = FlexSidebarComponent.RESPONSIVE_STATE_PC;

  constructor(private sidebarService: FlexSidebarService,
              private themeService: FlexThemeService,
              private element: ElementRef) {
  }

  toggleResponsive(enabled: boolean) {
    if (enabled) {
      this.mediaQuerySubscription = this.onMediaQueryChanges();
    } else if (this.mediaQuerySubscription) {
      this.mediaQuerySubscription.unsubscribe();
    }
  }

  ngOnChanges(changes) {
    if (changes.responsive) {
      this.toggleResponsive(this.responsiveValue);
    }
  }

  ngOnInit() {
    this.sidebarService.onToggle()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { compact: boolean, tag: string }) => {
        if (!this.tag || this.tag === data.tag) {
          this.toggle(data.compact);
        }
      });

    this.sidebarService.onExpand()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { tag: string }) => {
        if (!this.tag || this.tag === data.tag) {
          this.expand();
        }
      });

    this.sidebarService.onCollapse()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { tag: string }) => {
        if (!this.tag || this.tag === data.tag) {
          this.collapse();
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
    if (this.mediaQuerySubscription) {
      this.mediaQuerySubscription.unsubscribe();
    }
  }

  onClick(event): void {
    const menu = this.element.nativeElement.querySelector('app-flex-menu');

    if (menu && menu.contains(event.target)) {
      const link = this.getMenuLink(event.target);

      if (link && link.nextElementSibling && link.nextElementSibling.classList.contains('menu-items')) {
        this.expand();
      }
    }
  }

  collapse() {
    this.state = FlexSidebarComponent.STATE_COLLAPSED;
  }

  expand() {
    this.state = FlexSidebarComponent.STATE_EXPANDED;
  }

  compact() {
    this.state = FlexSidebarComponent.STATE_COMPACTED;
  }

  toggle(compact: boolean = false) {
    if (this.responsiveEnabled()) {
      if (this.responsiveState === FlexSidebarComponent.RESPONSIVE_STATE_MOBILE) {
        compact = false;
      }
    }

    const closedStates = [FlexSidebarComponent.STATE_COMPACTED, FlexSidebarComponent.STATE_COLLAPSED];
    if (compact) {
      this.state = closedStates.includes(this.stateValue) ?
        FlexSidebarComponent.STATE_EXPANDED : FlexSidebarComponent.STATE_COMPACTED;
    } else {
      this.state = closedStates.includes(this.stateValue) ?
        FlexSidebarComponent.STATE_EXPANDED : FlexSidebarComponent.STATE_COLLAPSED;
    }
  }

  protected onMediaQueryChanges(): Subscription {
    return this.themeService.onMediaQueryChange()
      .subscribe(([prev, current]: [FlexMediaBreakpoint, FlexMediaBreakpoint]) => {

        const isCollapsed = this.collapsedBreakpoints.includes(current.name);
        const isCompacted = this.compactedBreakpoints.includes(current.name);

        if (isCompacted) {
          this.fixed = this.containerFixedValue;
          this.compact();
          this.responsiveState = FlexSidebarComponent.RESPONSIVE_STATE_TABLET;
        }
        if (isCollapsed) {
          this.fixed = true;
          this.collapse();
          this.responsiveState = FlexSidebarComponent.RESPONSIVE_STATE_MOBILE;
        }
        if (!isCollapsed && !isCompacted && prev.width < current.width) {
          this.expand();
          this.fixed = false;
          this.responsiveState = FlexSidebarComponent.RESPONSIVE_STATE_PC;
        }
      });
  }

  protected responsiveEnabled(): boolean {
    return this.responsiveValue;
  }

  protected getMenuLink(element: HTMLElement): HTMLElement | undefined {
    if (!element || element.tagName.toLowerCase() === 'app-flex-menu') {
      return;
    }

    if (element.tagName.toLowerCase() === 'a') {
      return element;
    }

    return this.getMenuLink(element.parentElement);
  }
}
