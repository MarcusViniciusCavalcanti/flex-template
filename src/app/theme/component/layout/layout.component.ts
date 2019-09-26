import {
  AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnDestroy,
  Renderer2, ViewChild, ViewContainerRef, Inject, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';

import { convertToBoolProperty } from '../helpers';
import { FlexThemeService } from '../../services/flex-theme.service';
import { FlexSpinnerService } from '../../services/spinner/flex-spinner.service';
import { FlexLayoutDirectionService } from '../../services/direction/flex-direction.service';
import { FlexRestoreScrollTopHelper } from './restore-scroll-top.service';
import { FlexScrollPosition, FlexLayoutScrollService } from '../../services/scroll/flex-scroll.service';
import { FlexLayoutDimensions, FlexLayoutRulerService } from '../../services/rules/flex-ruler.service';
import { FLEX_WINDOW, FLEX_DOCUMENT } from '../../theme.options';
import { FlexOverlayContainerAdapter } from '../cdk/adapter/overlay-container-adapter';

@Component({
  selector: 'app-flex-layout',
  styleUrls: ['./layout.component.scss'],
  template: `
    <div class="scrollable-container" #scrollableContainer (scroll)="onScroll($event)">
      <div class="layout" #layoutContainer>
        <ng-content select="app-flex-layout-header:not([subheader])"></ng-content>
        <div class="layout-container">
          <ng-content select="app-flex-sidebar"></ng-content>
          <div class="content" [class.center]="centerValue">
            <ng-content select="app-flex-layout-header[subheader]"></ng-content>
            <div class="columns">
              <ng-content select="app-flex-layout-column"></ng-content>
            </div>
            <ng-content select="app-flex-layout-footer"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FlexLayoutComponent implements AfterViewInit, OnDestroy {

  protected scrollBlockClass = 'ng-global-scrollblock';
  protected isScrollBlocked = false;
  protected scrollableContainerOverflowOldValue: string;
  protected layoutPaddingOldValue: { left: string; right: string };

  centerValue = false;
  restoreScrollTopValue = true;

  @HostBinding('class.window-mode') windowModeValue = false;
  @HostBinding('class.with-scroll') withScrollValue = false;
  @HostBinding('class.with-subheader') withSubheader = false;

  @Input()
  set center(val: boolean) {
    this.centerValue = convertToBoolProperty(val);
  }

  @Input()
  set windowMode(val: boolean) {
    this.windowModeValue = convertToBoolProperty(val);
    this.withScroll = this.windowModeValue;
  }

  @Input()
  set withScroll(val: boolean) {
    this.withScrollValue = convertToBoolProperty(val);

    const body = this.document.getElementsByTagName('body')[0];
    if (this.withScrollValue) {
      this.renderer.setStyle(body, 'overflow', 'hidden');
    } else {
      this.renderer.setStyle(body, 'overflow', 'initial');
    }
  }

  @Input()
  set restoreScrollTop(val: boolean) {
    this.restoreScrollTopValue = convertToBoolProperty(val);
  }

  // TODO remove as of 5.0.0
  @ViewChild('layoutTopDynamicArea', { read: ViewContainerRef, static: false }) veryTopRef: ViewContainerRef;

  @ViewChild('scrollableContainer', { read: ElementRef, static: false })
  scrollableContainerRef: ElementRef<HTMLElement>;

  @ViewChild('layoutContainer', { read: ElementRef, static: false })
  layoutContainerRef: ElementRef<HTMLElement>;

  protected afterViewInit$ = new BehaviorSubject(null);

  private alive = true;

  constructor(
    protected themeService: FlexThemeService,
    protected spinnerService: FlexSpinnerService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    @Inject(FLEX_WINDOW) protected window,
    @Inject(FLEX_DOCUMENT) protected document,
    @Inject(PLATFORM_ID) protected platformId: {},
    protected layoutDirectionService: FlexLayoutDirectionService,
    protected scrollService: FlexLayoutScrollService,
    protected rulerService: FlexLayoutRulerService,
    protected scrollTop: FlexRestoreScrollTopHelper,
    protected overlayContainer: FlexOverlayContainerAdapter,
  ) {
    this.registerAsOverlayContainer();

    this.themeService.onThemeChange()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe((theme: any) => {
        const body = this.document.getElementsByTagName('body')[0];
        if (theme.previous) {
          // todo resolver nb
          this.renderer.removeClass(body, `nb-theme-${theme.previous}`);
        }
        this.renderer.addClass(body, `nb-theme-${theme.name}`);
      });

    this.themeService.onAppendLayoutClass()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe((className: string) => {
        this.renderer.addClass(this.elementRef.nativeElement, className);
      });

    this.themeService.onRemoveLayoutClass()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe((className: string) => {
        this.renderer.removeClass(this.elementRef.nativeElement, className);
      });

    this.spinnerService.registerLoader(new Promise((resolve, reject) => {
      this.afterViewInit$
        .pipe(
          takeWhile(() => this.alive),
        )
        .subscribe((_) => resolve());
    }));
    this.spinnerService.load();

    this.rulerService.onGetDimensions()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(({ listener }) => {
        listener.next(this.getDimensions());
        listener.complete();
      });

    this.scrollService.onGetPosition()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(({ listener }) => {
        listener.next(this.getScrollPosition());
        listener.complete();
      });

    this.scrollTop
      .shouldRestore()
      .pipe(
        filter(() => this.restoreScrollTopValue),
        takeWhile(() => this.alive),
      )
      .subscribe(() => {
        this.scroll(0, 0);
      });

    this.scrollService
      .onScrollableChange()
      .pipe(
        filter(() => this.withScrollValue),
      )
      .subscribe((scrollable: boolean) => {
        if (scrollable) {
          this.enableScroll();
        } else {
          this.blockScroll();
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      this.themeService.changeWindowWidth(this.window.innerWidth);
    }
  }

  ngAfterViewInit() {
    this.layoutDirectionService.onDirectionChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(direction => this.document.dir = direction);

    this.scrollService.onManualScroll()
      .pipe(takeWhile(() => this.alive))
      .subscribe(({ x, y }: FlexScrollPosition) => this.scroll(x, y));

    this.afterViewInit$.next(true);
  }

  ngOnDestroy() {
    this.alive = false;
    this.unregisterAsOverlayContainer();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    this.scrollService.fireScrollChange($event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.themeService.changeWindowWidth(event.target.innerWidth);
  }

  getDimensions(): FlexLayoutDimensions {
    let clientWidth = 0;
    let clientHeight = 0;
    let scrollWidth = 0;
    let scrollHeight = 0;

    if (this.withScrollValue) {
      const container = this.scrollableContainerRef.nativeElement;
      clientWidth = container.clientWidth;
      clientHeight = container.clientHeight;
      scrollWidth = container.scrollWidth;
      scrollHeight = container.scrollHeight;
    } else {
      const { documentElement, body } = this.document;
      clientWidth = documentElement.clientWidth || body.clientWidth;
      clientHeight = documentElement.clientHeight || body.clientHeight;
      scrollWidth = documentElement.scrollWidth || body.scrollWidth;
      scrollHeight = documentElement.scrollHeight || body.scrollHeight;
    }

    return {
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
    };
  }

  getScrollPosition(): FlexScrollPosition {
    if (!isPlatformBrowser(this.platformId)) {
      return { x: 0, y: 0 };
    }

    if (this.withScrollValue) {
      const container = this.scrollableContainerRef.nativeElement;
      return { x: container.scrollLeft, y: container.scrollTop };
    }

    const documentRect = this.document.documentElement.getBoundingClientRect();

    // deveria ser 0 - 0
    const x = -documentRect.left || this.document.body.scrollLeft || this.window.scrollX ||
      this.document.documentElement.scrollLeft || 0;

    // deveria ser 0 é -10
    const y = -documentRect.top || this.document.body.scrollTop || this.window.scrollY ||
      this.document.documentElement.scrollTop || 0;


    return { x, y };
  }

  protected registerAsOverlayContainer() {
    if (this.overlayContainer.setContainer) {
      this.overlayContainer.setContainer(this.elementRef.nativeElement);
    }
  }

  protected unregisterAsOverlayContainer() {
    if (this.overlayContainer.clearContainer) {
      this.overlayContainer.clearContainer();
    }
  }

  private scroll(x: number = null, y: number = null) {
    const { x: currentX, y: currentY } = this.getScrollPosition();
    x = x == null ? currentX : x;
    y = y == null ? currentY : y;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.withScrollValue) {
      const scrollable = this.scrollableContainerRef.nativeElement;
      if (scrollable.scrollTo) {
        scrollable.scrollTo(x, y);
      } else {
        scrollable.scrollLeft = x;
        scrollable.scrollTop = y;
      }
    } else {
      this.window.scrollTo(x, y);
    }
  }

  protected blockScroll() {
    if (this.isScrollBlocked) {
      return;
    }

    this.isScrollBlocked = true;

    this.renderer.addClass(this.document.documentElement, this.scrollBlockClass);

    const scrollableContainerElement = this.scrollableContainerRef.nativeElement;
    const layoutElement = this.layoutContainerRef.nativeElement;

    const layoutWithScrollWidth = layoutElement.clientWidth;
    this.scrollableContainerOverflowOldValue = scrollableContainerElement.style.overflow;
    scrollableContainerElement.style.overflow = 'hidden';
    const layoutWithoutScrollWidth = layoutElement.clientWidth;
    const scrollWidth = layoutWithoutScrollWidth - layoutWithScrollWidth;

    if (!scrollWidth) {
      return;
    }

    this.layoutPaddingOldValue = {
      left: layoutElement.style.paddingLeft,
      right: layoutElement.style.paddingRight,
    };

    if (this.layoutDirectionService.isLtr()) {
      layoutElement.style.paddingRight = `${scrollWidth}px`;
    } else {
      layoutElement.style.paddingLeft = `${scrollWidth}px`;
    }
  }

  private enableScroll() {
    if (this.isScrollBlocked) {
      this.isScrollBlocked = false;

      this.renderer.removeClass(this.document.documentElement, this.scrollBlockClass);
      this.scrollableContainerRef.nativeElement.style.overflow = this.scrollableContainerOverflowOldValue;

      if (this.layoutPaddingOldValue) {
        const layoutElement = this.layoutContainerRef.nativeElement;
        layoutElement.style.paddingLeft = this.layoutPaddingOldValue.left;
        layoutElement.style.paddingRight = this.layoutPaddingOldValue.right;
        this.layoutPaddingOldValue = null;
      }
    }
  }
}

@Component({
  selector: 'app-flex-layout-column',
  template: `
    <ng-content></ng-content>
  `,
})
export class FlexLayoutColumnComponent {

  @HostBinding('class.left') leftValue: boolean;
  @HostBinding('class.start') startValue: boolean;


  @Input()
  set left(val: boolean) {
    this.leftValue = convertToBoolProperty(val);
    this.startValue = false;
  }

  @Input()
  set start(val: boolean) {
    this.startValue = convertToBoolProperty(val);
    this.leftValue = false;
  }
}

@Component({
  selector: 'app-flex-layout-header',
  template: `
    <nav [class.fixed]="fixedValue">
      <ng-content></ng-content>
    </nav>
  `,
})
export class FlexLayoutHeaderComponent {

  @HostBinding('class.fixed') fixedValue: boolean;
  @HostBinding('class.subheader') subheaderValue: boolean;

  constructor(private layout: FlexLayoutComponent) {}

  @Input()
  set fixed(val: boolean) {
    this.fixedValue = convertToBoolProperty(val);
  }

  @Input()
  set subheader(val: boolean) {
    this.subheaderValue = convertToBoolProperty(val);
    this.fixedValue = false;
    this.layout.withSubheader = this.subheaderValue;
  }
}

@Component({
  selector: 'app-flex-layout-footer',
  template: `
    <nav [class.fixed]="fixedValue">
      <ng-content></ng-content>
    </nav>
  `,
})
export class FlexLayoutFooterComponent {

  @HostBinding('class.fixed') fixedValue: boolean;

  @Input()
  set fixed(val: boolean) {
    this.fixedValue = convertToBoolProperty(val);
  }

}
