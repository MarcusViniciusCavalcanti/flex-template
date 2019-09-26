import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injectable,
  Input,
  Type,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { FlexRenderableContainer } from '../../container/flex-renderable-container';
import { FlexPositionBuilderService, } from '../../position/overlay-position';
import { FlexDynamicOverlay } from '../flex-dynamic-overlay';
import { FlexOverlayContent } from '../../overlay-service';
import { FlexDynamicOverlayHandler } from './flex-dynamic-overlay-handler';
import { FlexDynamicOverlayChange } from './flex-dynamic-overlay-change';
import { FlexAdjustableConnectedPositionStrategy } from '../../position/strategy/flex-adjustable-connected-position-strategy';
import { FlexPosition } from '../../position/flex-position';
import { FlexAdjustment } from '../../position/flex-adjustment';
import { FlexTrigger } from '../../trigger/flex-trigger';
import { FlexTriggerStrategy } from '../../trigger/strategy/flex-trigger-strategy';
import { FlexTriggerStrategyBuilderService } from '../../trigger/overlay-trigger';

@Component({ template: '' })
export class DynamicOverlayMockComponent implements FlexRenderableContainer {

  @Input() content: any;
  @Input() context: {};
  @Input() cfr: ComponentFactoryResolver;

  renderContent() { }
}

@Component({ template: '' })
export class DynamicOverlayMock2Component extends DynamicOverlayMockComponent { }

export class MockDynamicOverlay {
  mockContainer = 'container';
  mockComponentType: Type<FlexRenderableContainer>;
  mockContext = {};
  mockContent: FlexOverlayContent;
  mockPositionStrategy: FlexAdjustableConnectedPositionStrategy;

  constructor() {}

  create(componentType: Type<FlexRenderableContainer>,
         content: FlexOverlayContent,
         context: {},
         positionStrategy: FlexAdjustableConnectedPositionStrategy) {

    this.setContext(context);
    this.setContent(content);
    this.setComponent(componentType);
    this.setPositionStrategy(positionStrategy);

    return this;
  }

  setContent(content: FlexOverlayContent) {
    this.mockContent = content;
  }

  setContext(context: {}) {
    this.mockContext = context;
  }

  setComponent(componentType: Type<FlexRenderableContainer>) {
    this.mockComponentType = componentType;
  }

  setContentAndContext(content: FlexOverlayContent, context: {}) {
    this.mockContent = content;
    this.mockContext = context;
  }

  setPositionStrategy(positionStrategy: FlexAdjustableConnectedPositionStrategy) {
    this.mockPositionStrategy = positionStrategy;
  }

  show() {
  }

  hide() {
  }

  toggle() {
  }

  dispose() {
  }

  getContainer() {
    return this.mockContainer;
  }
}

export class MockPositionBuilder {
  positionChange = new Subject();
  mockConnectedTo: ElementRef<any>;
  mockPosition: FlexPosition;
  mockAdjustment: FlexAdjustment;
  mockOffset: number;

  connectedTo(connectedTo: ElementRef<any>) {
    this.mockConnectedTo = connectedTo;
    return this;
  }

  position(position: FlexPosition) {
    this.mockPosition = position;
    return this;
  }

  adjustment(adjustment: FlexAdjustment) {
    this.mockAdjustment = adjustment;
    return this;
  }

  offset(offset) {
    this.mockOffset = offset;
    return this;
  }

  attach() {}

  apply() {}

  detach() {}

  dispose() {}
}

@Injectable()
export class MockTriggerStrategyBuilder {

  mockHost: HTMLElement;
  mockContainer: () => ComponentRef<any>;
  mockTrigger: FlexTrigger;

  show$ = new Subject<any>();
  hide$ = new Subject<any>();

  private destroyed$ = new Subject();

  trigger(trigger: FlexTrigger): this {
    this.mockTrigger = trigger;
    return this;
  }

  host(host: HTMLElement): this {
    this.mockHost = host;
    return this;
  }

  container(container: () => ComponentRef<any>): this {
    this.mockContainer = container;
    return this;
  }

  build(): FlexTriggerStrategy {
    return {
      show$: this.show$.asObservable().pipe(takeUntil(this.destroyed$)),
      hide$: this.hide$.asObservable().pipe(takeUntil(this.destroyed$)),
      destroy: () => this.destroyed$.next(),
    };
  }
}

describe('dynamic-overlay-change', () => {

  it('should check if string is changed', () => {
    const change = new FlexDynamicOverlayChange('prev', 'next');

    expect(change.isChanged()).toBe(true);
  });

  it('should check if object is changed', () => {
    const obj = {};
    const obj1 = {};
    const change = new FlexDynamicOverlayChange(obj, obj1);

    expect(change.isChanged()).toBe(true);
  });

  it('should set isFirstChange to false by default', () => {
    const obj = {};
    const obj1 = {};
    const change = new FlexDynamicOverlayChange(obj, obj1);

    expect(change.isChanged()).toBe(true);
    expect(change.isFirstChange()).toBe(false);

    const change2 = new FlexDynamicOverlayChange(obj, obj1, true);

    expect(change2.isChanged()).toBe(true);
    expect(change2.isFirstChange()).toBe(true);
  });
});

describe('dynamic-overlay-handler', () => {

  let overlayHandler: FlexDynamicOverlayHandler;
  let dynamicOverlay: any;
  let triggerStrategyBuilder: any;
  let positionBuilder: any;

  const configure = (host?): any => {
    host = host ? host : new ElementRef(document.createElement('b'));
    return overlayHandler
      .componentType(DynamicOverlayMockComponent)
      .host(host);
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    const bed = TestBed.configureTestingModule({
      declarations: [DynamicOverlayMockComponent, DynamicOverlayMock2Component],
      providers: [
        FlexDynamicOverlayHandler,
        { provide: FlexDynamicOverlay, useClass: MockDynamicOverlay },
        { provide: FlexTriggerStrategyBuilderService, useClass: MockTriggerStrategyBuilder },
        { provide: FlexPositionBuilderService, useClass: MockPositionBuilder },
      ],
    });
    overlayHandler = bed.get(FlexDynamicOverlayHandler);
    dynamicOverlay = bed.get(FlexDynamicOverlay);
    triggerStrategyBuilder = bed.get(FlexTriggerStrategyBuilderService);
    positionBuilder = bed.get(FlexPositionBuilderService);
  });

  it('should throw if nothing passed', () => {
    expect(() => overlayHandler.build()).toThrow();
  });

  it('should throw if only component type passed', () => {
    expect(() => overlayHandler.componentType(DynamicOverlayMockComponent).build()).toThrow();
  });

  it('should throw if only host type passed', () => {
    const host = new ElementRef(document.createElement('b'));
    expect(() => overlayHandler.host(host).build()).toThrow();
  });

  it('connect should throw if overlay not created', () => {
    expect(() => overlayHandler.connect()).toThrow();
  });

  it('rebuild should not throw if overlay not created', () => {
    expect(() => overlayHandler.rebuild()).not.toThrow();
  });

  it('should build when componentType passed', () => {
    const host = new ElementRef(document.createElement('b'));
    const dynamic: any = configure(host).build();

    expect(dynamic.mockComponentType).toBe(DynamicOverlayMockComponent);
    expect(triggerStrategyBuilder.mockHost).toBe(host.nativeElement);
    expect(triggerStrategyBuilder.mockTrigger).toBe(FlexTrigger.NOOP);
    expect(triggerStrategyBuilder.mockContainer()).toBe(dynamicOverlay.mockContainer);

    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);
  });

  it('should show/hide overlay when trigger strategy first', () => {
    const dynamic: any = configure().build();

    const showSpy = spyOn(dynamic, 'show').and.callThrough();
    const hideSpy = spyOn(dynamic, 'hide').and.callThrough();

    triggerStrategyBuilder.show$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(0);

    triggerStrategyBuilder.hide$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);
  });

  it('should destroy overlay and disconnect from trigger strategy', () => {
    const dynamic: any = configure().build();

    const showSpy = spyOn(dynamic, 'show').and.callThrough();
    const hideSpy = spyOn(dynamic, 'hide').and.callThrough();
    const disposeSpy = spyOn(dynamic, 'dispose').and.callThrough();

    triggerStrategyBuilder.show$.next(true);
    triggerStrategyBuilder.hide$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).toHaveBeenCalledTimes(0);

    overlayHandler.destroy();

    triggerStrategyBuilder.show$.next(true);
    triggerStrategyBuilder.hide$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });

  it('should not destroy if nothing to destroy', () => {
    const disposeSpy = spyOn(dynamicOverlay, 'dispose').and.callThrough();

    overlayHandler.destroy();
    expect(disposeSpy).toHaveBeenCalledTimes(0);
  });

  it('should not listen when disconnected', () => {
    const dynamic: any = configure().build();

    const showSpy = spyOn(dynamic, 'show').and.callThrough();
    const hideSpy = spyOn(dynamic, 'hide').and.callThrough();

    triggerStrategyBuilder.show$.next(true);
    triggerStrategyBuilder.hide$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);

    overlayHandler.disconnect();

    triggerStrategyBuilder.show$.next(true);
    triggerStrategyBuilder.hide$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);

    overlayHandler.connect();

    triggerStrategyBuilder.show$.next(true);
    triggerStrategyBuilder.hide$.next(true);

    expect(showSpy).toHaveBeenCalledTimes(2);
    expect(hideSpy).toHaveBeenCalledTimes(2);
  });

  it('should set and update trigger', () => {
    const host = new ElementRef(document.createElement('b'));
    configure(host).trigger(FlexTrigger.CLICK).build();
    expect(triggerStrategyBuilder.mockHost).toBe(host.nativeElement);
    expect(triggerStrategyBuilder.mockTrigger).toBe(FlexTrigger.CLICK);
    expect(triggerStrategyBuilder.mockContainer()).toBe(dynamicOverlay.mockContainer);

    configure(host).trigger(FlexTrigger.HOVER).rebuild();
    expect(triggerStrategyBuilder.mockTrigger).toBe(FlexTrigger.HOVER);
    expect(triggerStrategyBuilder.mockHost).toBe(host.nativeElement);
    expect(triggerStrategyBuilder.mockTrigger).toBe(FlexTrigger.HOVER);
    expect(triggerStrategyBuilder.mockContainer()).toBe(dynamicOverlay.mockContainer);
  });

  it('should disconnect from prev trigger', () => {
    const triggerShow1$ = new Subject<any>();
    const triggerHide1$ = new Subject<any>();

    const triggerShow2$ = new Subject<any>();
    const triggerHide2$ = new Subject<any>();
    triggerStrategyBuilder.show$ = triggerShow1$;
    triggerStrategyBuilder.hide$ = triggerHide1$;

    let dynamic: any = configure().build();
    const showSpy = spyOn(dynamic, 'show').and.callThrough();
    const hideSpy = spyOn(dynamic, 'hide').and.callThrough();

    triggerShow1$.next();
    triggerHide1$.next();

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);

    // rebuild the overlay
    // so that it should disconnect from old subscribers and lister to new only
    triggerStrategyBuilder.show$ = triggerShow2$;
    triggerStrategyBuilder.hide$ = triggerHide2$;
    dynamic = configure().trigger(FlexTrigger.HOVER).rebuild();

    triggerShow1$.next();
    triggerHide1$.next();

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(hideSpy).toHaveBeenCalledTimes(1);

    triggerShow2$.next();
    triggerHide2$.next();

    expect(showSpy).toHaveBeenCalledTimes(2);
    expect(hideSpy).toHaveBeenCalledTimes(2);
  });

  it('should set and update host', () => {
    const host1 = new ElementRef(document.createElement('b'));
    const host2 = new ElementRef(document.createElement('b'));

    configure(host1).build();
    expect(triggerStrategyBuilder.mockHost).toBe(host1.nativeElement);
    expect(triggerStrategyBuilder.mockTrigger).toBe(FlexTrigger.NOOP);
    expect(triggerStrategyBuilder.mockContainer()).toBe(dynamicOverlay.mockContainer);
    expect(positionBuilder.mockConnectedTo).toBe(host1);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);
    expect(positionBuilder.mockOffset).toBe(15);

    configure().host(host2).rebuild();
    expect(triggerStrategyBuilder.mockHost).toBe(host2.nativeElement);
    expect(triggerStrategyBuilder.mockTrigger).toBe(FlexTrigger.NOOP);
    expect(triggerStrategyBuilder.mockContainer()).toBe(dynamicOverlay.mockContainer);
    expect(positionBuilder.mockConnectedTo).toBe(host2);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);
    expect(positionBuilder.mockOffset).toBe(15);
  });

  it('should set and update position', () => {
    const host = new ElementRef(document.createElement('b'));
    configure(host).position(FlexPosition.BOTTOM).build();
    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.BOTTOM);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);

    configure(host).position(FlexPosition.LEFT).rebuild();
    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.LEFT);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);
  });

  it('should set and update adjustment', () => {
    const host = new ElementRef(document.createElement('b'));
    configure(host).adjustment(FlexAdjustment.CLOCKWISE).build();
    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.CLOCKWISE);

    configure(host).adjustment(FlexAdjustment.COUNTERCLOCKWISE).rebuild();
    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.COUNTERCLOCKWISE);
  });

  it('should set and update offset', () => {
    const host = new ElementRef(document.createElement('b'));
    configure(host).offset(34).build();
    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);
    expect(positionBuilder.mockOffset).toBe(34);

    configure(host).offset(2).rebuild();
    expect(positionBuilder.mockConnectedTo).toBe(host);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.TOP);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.NOOP);
    expect(positionBuilder.mockOffset).toBe(2);
  });

  it('should set and update content', () => {
    const content1 = 'new content';
    const content2 = 'new new content';

    let dynamic: any = configure().content(content1).build();
    expect(dynamic.mockContent).toBe(content1);

    dynamic = configure().content(content2).rebuild();
    expect(dynamic.mockContent).toBe(content2);
  });

  it('should set and update context', () => {
    const context1 = { a: 1 };
    const context2 = { a: 1, b: 3 };

    let dynamic: any = configure().context(context1).build();
    expect(dynamic.mockContext).toBe(context1);

    dynamic = configure().context(context2).rebuild();
    expect(dynamic.mockContext).toBe(context2);
  });

  it('should set and update componentType', () => {

    let dynamic: any = configure().componentType(DynamicOverlayMockComponent).build();
    expect(dynamic.mockComponentType).toBe(DynamicOverlayMockComponent);

    dynamic = configure().componentType(DynamicOverlayMock2Component).rebuild();
    expect(dynamic.mockComponentType).toBe(DynamicOverlayMock2Component);
  });

  it('should set and update position, host and adjustment', () => {
    const host1 = new ElementRef(document.createElement('b'));
    const host2 = new ElementRef(document.createElement('b'));

    configure(host1)
      .position(FlexPosition.BOTTOM)
      .adjustment(FlexAdjustment.CLOCKWISE)
      .build();

    expect(positionBuilder.mockConnectedTo).toBe(host1);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.BOTTOM);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.CLOCKWISE);

    configure(host2)
      .position(FlexPosition.LEFT)
      .adjustment(FlexAdjustment.HORIZONTAL)
      .build();

    expect(positionBuilder.mockConnectedTo).toBe(host2);
    expect(positionBuilder.mockPosition).toBe(FlexPosition.LEFT);
    expect(positionBuilder.mockAdjustment).toBe(FlexAdjustment.HORIZONTAL);
  });
});
