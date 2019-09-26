import { TestBed } from '@angular/core/testing';
import { Component, ComponentFactoryResolver, EventEmitter, Input, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { ScrollStrategy } from '@angular/cdk/overlay';

import { FlexDynamicOverlay } from './flex-dynamic-overlay';
import { FlexOverlayService } from '../overlay-service';
import { FlexRenderableContainer } from '../container/flex-renderable-container';
import { FlexComponentPortal, FlexOverlayConfig, FlexOverlayContainer } from '../flex-cdk-mapping.module';

@Component({ template: '' })
export class DynamicOverlayMockComponent implements FlexRenderableContainer {

  @Input() content: any;
  @Input() context: {};
  @Input() cfr: ComponentFactoryResolver;

  renderContent() { }
}

@Component({ template: '' })
export class DynamicOverlayMock2Component extends DynamicOverlayMockComponent { }


export class MockNgZone extends NgZone {
  onStable: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({enableLongStackTrace: false});
  }

  run(fn: () => void): any {
    return fn();
  }

  runOutsideAngular(fn: () => void): any {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }
}

const instance = {
  position: '',
  content: '',
  context: null,
  cfr: null,
  renderContent() {},
};

const container: any = {
  instance,
  changeDetectorRef: { detectChanges: () => {} },
};

const ref = {
  portal: null,

  hasAttached(): any {},
  updatePosition() {},
  updatePositionStrategy() {},

  attach(portal: FlexComponentPortal) {
    this.portal = portal;
    return container;
  },

  detach() {},
  dispose() {},
};

const repositionRes = 'something';
const scrollStrategies = {
  reposition: () => (repositionRes as unknown) as ScrollStrategy,
};

export class OverlayContainerMock {
  getContainerElement() {
    return { contains() { return true; } };
  }
}

export class OverlayServiceMock {
  // tslint:disable-next-line:variable-name
  _config: FlexOverlayConfig;

  get scrollStrategies() {
    return scrollStrategies;
  }

  create(config: FlexOverlayConfig) {
    this._config = config;

    return ref;
  }
}

class PositionStrategy {
  constructor(public position: string) {}
  positionChange = new Subject<any>();
}

const bottomPositionStrategy: any = new PositionStrategy('bottom');
const topPositionStrategy: any = new PositionStrategy('top');

describe('dynamic-overlay', () => {
  let dynamicOverlayService: FlexDynamicOverlay;
  let dynamicOverlay: FlexDynamicOverlay;
  let overlayService: OverlayServiceMock;
  let zone: MockNgZone;
  let componentFactoryResolver: ComponentFactoryResolver;
  const content = 'Overlay Content';
  const context = {};

  beforeEach(() => {
    TestBed.resetTestingModule();
    const bed = TestBed.configureTestingModule({
      declarations: [DynamicOverlayMockComponent, DynamicOverlayMock2Component],
      providers: [
        FlexDynamicOverlay,
        { provide: FlexOverlayService, useClass: OverlayServiceMock },
        { provide: NgZone, useClass: MockNgZone },
        { provide: FlexOverlayContainer, useClass: OverlayContainerMock },
      ],
    });
    overlayService = bed.get(FlexOverlayService);
    dynamicOverlayService = bed.get(FlexDynamicOverlay);
    componentFactoryResolver = bed.get(ComponentFactoryResolver);
    zone = bed.get(NgZone);
  });

  beforeEach(() => {
    dynamicOverlay = dynamicOverlayService.create(
      DynamicOverlayMockComponent,
      content,
      context,
      bottomPositionStrategy,
    );
  });

  afterEach(() => {
    dynamicOverlay.dispose();
  });

  it('should create overlay when show called', () => {
    const createOverlaySpy = spyOn(overlayService, 'create').and.callThrough();
    const renderSpy = spyOn(instance, 'renderContent').and.callThrough();
    const repositionSpy = spyOn(scrollStrategies, 'reposition').and.callThrough();
    const attachSpy = spyOn(ref, 'attach').and.callThrough();
    dynamicOverlay.show();
    spyOn(ref, 'hasAttached').and.returnValue(true);

    expect(createOverlaySpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(repositionSpy).toHaveBeenCalledTimes(1);
    expect(attachSpy).toHaveBeenCalledTimes(1);

    expect(overlayService._config.positionStrategy as any).toBe(bottomPositionStrategy);
    expect(overlayService._config.scrollStrategy as any).toBe(repositionRes);
    expect(dynamicOverlay.isAttached).toBe(true);

    expect(ref.portal.component).toBe(DynamicOverlayMockComponent);
    expect(instance.content).toBe(content);
    expect(instance.context).toBe(context);
    expect(instance.cfr).toBe(componentFactoryResolver);
  });

  it('should destroy overlay when hide called', () => {
    const detachSpy = spyOn(ref, 'detach').and.callThrough();
    dynamicOverlay.show();
    dynamicOverlay.hide();
    spyOn(ref, 'hasAttached').and.returnValue(false);

    expect(detachSpy).toHaveBeenCalledTimes(1);
    expect(dynamicOverlay.isAttached).toBe(false);
    expect(dynamicOverlay.getContainer()).toBe(null);
  });

  it('should not create ref on the second time', () => {
    const detachSpy = spyOn(ref, 'detach').and.callThrough();
    const createOverlaySpy = spyOn(overlayService, 'create').and.callThrough();
    const hasAttacheSpy = spyOn(ref, 'hasAttached');

    dynamicOverlay.show();
    hasAttacheSpy.and.returnValue(true);

    expect(detachSpy).toHaveBeenCalledTimes(0);
    expect(dynamicOverlay.isAttached).toBe(true);
    expect(dynamicOverlay.getContainer()).toBe(container);
    expect(createOverlaySpy).toHaveBeenCalledTimes(1);

    dynamicOverlay.hide();
    hasAttacheSpy.and.returnValue(false);

    expect(detachSpy).toHaveBeenCalledTimes(1);
    expect(dynamicOverlay.isAttached).toBe(false);
    expect(dynamicOverlay.getContainer()).toBe(null);
    expect(createOverlaySpy).toHaveBeenCalledTimes(1);

    dynamicOverlay.show();
    hasAttacheSpy.and.returnValue(true);

    expect(detachSpy).toHaveBeenCalledTimes(1);
    expect(dynamicOverlay.isAttached).toBe(true);
    expect(dynamicOverlay.getContainer()).toBe(container);
    expect(createOverlaySpy).toHaveBeenCalledTimes(1);
  });

  it('should not attach to ref if already shown', () => {
    const attachSpy = spyOn(ref, 'attach').and.callThrough();
    const hasAttacheSpy = spyOn(ref, 'hasAttached');

    dynamicOverlay.show();
    hasAttacheSpy.and.returnValue(true);

    expect(attachSpy).toHaveBeenCalledTimes(1);

    dynamicOverlay.show();

    expect(attachSpy).toHaveBeenCalledTimes(1);
  });

  it('should create/destroy overlay when toggle called', () => {
    const createOverlaySpy = spyOn(overlayService, 'create').and.callThrough();
    const renderSpy = spyOn(instance, 'renderContent').and.callThrough();
    const repositionSpy = spyOn(scrollStrategies, 'reposition').and.callThrough();
    const attachSpy = spyOn(ref, 'attach').and.callThrough();
    const detachSpy = spyOn(ref, 'detach').and.callThrough();
    const hasAttacheSpy = spyOn(ref, 'hasAttached');

    hasAttacheSpy.and.returnValue(false);

    dynamicOverlay.toggle();

    expect(createOverlaySpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(repositionSpy).toHaveBeenCalledTimes(1);
    expect(attachSpy).toHaveBeenCalledTimes(1);
    expect(detachSpy).toHaveBeenCalledTimes(0);

    hasAttacheSpy.and.returnValue(true);

    dynamicOverlay.toggle();

    expect(createOverlaySpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(repositionSpy).toHaveBeenCalledTimes(1);
    expect(attachSpy).toHaveBeenCalledTimes(1);
    expect(detachSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispose ref', () => {
    const detachSpy = spyOn(ref, 'detach').and.callThrough();
    const disposeSpy = spyOn(ref, 'dispose').and.callThrough();
    dynamicOverlay.show();
    dynamicOverlay.dispose();

    expect(detachSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });

  it('should set content', () => {
    const newContent = 'new content';
    dynamicOverlay.setContent(newContent);
    dynamicOverlay.show();

    expect(instance.content).toBe(newContent);
  });

  it('should return container', () => {
    dynamicOverlay.show();
    expect(dynamicOverlay.getContainer()).toBe(container as any);
  });

  it('should set content when shown', () => {
    const renderContentSpy = spyOn(instance, 'renderContent').and.callThrough();
    const updatePositionSpy = spyOn(ref, 'updatePosition').and.callThrough();

    dynamicOverlay.show();
    const newContent = 'new content';
    zone.simulateZoneExit();
    dynamicOverlay.setContent(newContent);

    expect(instance.content).toBe(newContent);
    expect(renderContentSpy).toHaveBeenCalledTimes(2);
    expect(updatePositionSpy).toHaveBeenCalledTimes(1);
  });

  it('should set context when shown', () => {
    const renderContentSpy = spyOn(instance, 'renderContent').and.callThrough();
    const updatePositionSpy = spyOn(ref, 'updatePosition').and.callThrough();

    dynamicOverlay.show();
    const newContext = { some: 'thing' };
    zone.simulateZoneExit();
    dynamicOverlay.setContext(newContext);

    expect(instance.context).toBe(newContext);
    expect(renderContentSpy).toHaveBeenCalledTimes(2);
    expect(updatePositionSpy).toHaveBeenCalledTimes(1);
  });

  it('should set context & content when shown', () => {
    const renderContentSpy = spyOn(instance, 'renderContent').and.callThrough();
    const updatePositionSpy = spyOn(ref, 'updatePosition').and.callThrough();

    dynamicOverlay.show();
    const newContext = { some: 'thing' };
    const newContent = 'new content';
    zone.simulateZoneExit();
    dynamicOverlay.setContent(newContent);
    zone.simulateZoneExit();
    dynamicOverlay.setContext(newContext);

    expect(instance.context).toBe(newContext);
    expect(instance.content).toBe(newContent);
    expect(renderContentSpy).toHaveBeenCalledTimes(3);
    expect(updatePositionSpy).toHaveBeenCalledTimes(2);
  });

  it('should set component', () => {
    const detachSpy = spyOn(ref, 'detach').and.callThrough();
    const disposeSpy = spyOn(ref, 'dispose').and.callThrough();
    const attachSpy = spyOn(ref, 'attach').and.callThrough();
    const hasAttacheSpy = spyOn(ref, 'hasAttached');

    dynamicOverlay.setComponent(DynamicOverlayMock2Component);

    expect(detachSpy).toHaveBeenCalledTimes(0);
    expect(disposeSpy).toHaveBeenCalledTimes(0);
    expect(attachSpy).toHaveBeenCalledTimes(0);

    dynamicOverlay.show();
    hasAttacheSpy.and.returnValue(true);

    expect(ref.portal.component).toBe(DynamicOverlayMock2Component);
    expect(detachSpy).toHaveBeenCalledTimes(0);
    expect(disposeSpy).toHaveBeenCalledTimes(0);
    expect(attachSpy).toHaveBeenCalledTimes(1);

    dynamicOverlay.setComponent(DynamicOverlayMockComponent);

    expect(ref.portal.component).toBe(DynamicOverlayMockComponent);
    expect(detachSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
    expect(attachSpy).toHaveBeenCalledTimes(2);

    dynamicOverlay.hide();
    hasAttacheSpy.and.returnValue(false);

    dynamicOverlay.setComponent(DynamicOverlayMock2Component);

    expect(detachSpy).toHaveBeenCalledTimes(3);
    expect(disposeSpy).toHaveBeenCalledTimes(2);
    expect(attachSpy).toHaveBeenCalledTimes(2);
  });

  it('should listen to position change', () => {
    dynamicOverlay.show();
    bottomPositionStrategy.positionChange.next('left');
    expect(instance.position).toEqual('left');
  });

  it('should set position strategy', () => {
    const updatePositionSpy = spyOn(ref, 'updatePositionStrategy').and.callThrough();
    dynamicOverlay.setPositionStrategy(topPositionStrategy);
    dynamicOverlay.show();

    // checking that the old subscription doesn't overlaps with the new one
    topPositionStrategy.positionChange.next('right');
    expect(instance.position).toEqual('right');
    expect(overlayService._config.positionStrategy as any).toBe(topPositionStrategy);

    bottomPositionStrategy.positionChange.next('left');
    expect(instance.position).toEqual('right');

    dynamicOverlay.setPositionStrategy(bottomPositionStrategy);
    bottomPositionStrategy.positionChange.next('left');
    expect(instance.position).toEqual('left');
    topPositionStrategy.positionChange.next('right');
    expect(instance.position).toEqual('left');
    expect(updatePositionSpy).toHaveBeenCalledTimes(1);
  });

  it(`should recreate overlay if it's host isn't child of overlay container`, () => {
    dynamicOverlay.show();
    dynamicOverlay.hide();

    const overlayContainer = TestBed.get(FlexOverlayContainer);
    const getContainerElementSpy = spyOn(overlayContainer, 'getContainerElement').and.returnValues(
      { contains() { return false; } },
      { contains() { return true; } },
    );

    dynamicOverlay.show();

    expect(getContainerElementSpy).toHaveBeenCalledTimes(2);
  });

  it(`should dispose overlay ref when recreating overlay`, () => {
    const disposeSpy = spyOn(ref, 'dispose').and.callThrough();

    dynamicOverlay.show();
    dynamicOverlay.hide();

    const overlayContainer = TestBed.get(FlexOverlayContainer);
    overlayContainer.getContainerElement = () => {
      overlayContainer.getContainerElement = () => ({ contains: () => true });
      return { contains: () => false };
    };

    dynamicOverlay.show();

    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });
});
