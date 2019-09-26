import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Type } from '@angular/core';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FlexRenderableContainer } from '../container/flex-renderable-container';
import { createContainer, FlexOverlayContent, FlexOverlayService, patch } from '../overlay-service';
import { FlexOverlayRef, FlexOverlayContainer } from '../flex-cdk-mapping.module';

import { FlexAdjustableConnectedPositionStrategy } from '../position/strategy/flex-adjustable-connected-position-strategy';
import { FlexPosition } from '../position/flex-position';

@Injectable()
export class FlexDynamicOverlay {

  protected ref: FlexOverlayRef;
  protected container: ComponentRef<FlexRenderableContainer>;
  protected componentType: Type<FlexRenderableContainer>;
  protected context = {};
  protected content: FlexOverlayContent;
  protected positionStrategy: FlexAdjustableConnectedPositionStrategy;

  protected positionStrategyChange$ = new Subject();
  protected alive = true;

  constructor(
    protected overlay: FlexOverlayService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected zone: NgZone,
    protected overlayContainer: FlexOverlayContainer) {
  }

  get isAttached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  create(componentType: Type<FlexRenderableContainer>,
         content: FlexOverlayContent,
         context: {},
         positionStrategy: FlexAdjustableConnectedPositionStrategy) {

    this.setContentAndContext(content, context);
    this.setComponent(componentType);
    this.setPositionStrategy(positionStrategy);

    return this;
  }

  setContent(content: FlexOverlayContent) {
    this.content = content;

    if (this.container) {
      this.updateContext();
    }
  }

  setContext(context: {}) {
    this.context = context;

    if (this.container) {
      this.updateContext();
    }
  }

  setContentAndContext(content: FlexOverlayContent, context: {}) {
    this.content = content;
    this.context = context;
    if (this.container) {
      this.updateContext();
    }
  }

  setComponent(componentType: Type<FlexRenderableContainer>) {
    this.componentType = componentType;

    if (this.ref && this.isAttached) {
      this.dispose();
      this.show();
    } else if (this.ref && !this.isAttached) {
      this.dispose();
    }
  }

  setPositionStrategy(positionStrategy: FlexAdjustableConnectedPositionStrategy) {
    this.positionStrategyChange$.next();

    this.positionStrategy = positionStrategy;

    this.positionStrategy.positionChange
      .pipe(
        takeWhile(() => this.alive),
        takeUntil(this.positionStrategyChange$),
        filter(() => !!this.container),
      )
      .subscribe((position: FlexPosition) => patch(this.container, { position }));

    if (this.ref) {
      this.ref.updatePositionStrategy(this.positionStrategy);
    }
  }

  show() {
    if (!this.ref) {
      this.createOverlay();
    }

    this.renderContainer();

    if (!this.hasOverlayInContainer()) {
      this.disposeOverlayRef();
      return this.show();
    }
  }

  hide() {
    if (!this.ref) {
      return;
    }

    this.ref.detach();
    this.container = null;
  }

  toggle() {
    if (this.isAttached) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this.alive = false;
    this.hide();
    this.disposeOverlayRef();
  }

  getContainer() {
    return this.container;
  }

  protected createOverlay() {
    this.ref = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.updatePositionWhenStable();
  }

  protected renderContainer() {
    const containerContext = this.createContainerContext();
    if (!this.container) {
      this.container = createContainer(this.ref, this.componentType, containerContext, this.componentFactoryResolver);
    }
    this.container.instance.renderContent();
  }

  protected updateContext() {
    const containerContext = this.createContainerContext();
    Object.assign(this.container.instance, containerContext);
    this.container.instance.renderContent();
    this.container.changeDetectorRef.detectChanges();
  }

  protected createContainerContext(): {} {
    return {
      content: this.content,
      context: this.context,
      cfr: this.componentFactoryResolver,
    };
  }

  protected updatePositionWhenStable() {
    this.zone.onStable
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.ref && this.ref.updatePosition());
  }

  protected hasOverlayInContainer(): boolean {
    return this.overlayContainer.getContainerElement().contains(this.ref.hostElement);
  }

  protected disposeOverlayRef() {
    if (this.ref) {
      this.ref.dispose();
      this.ref = null;
      this.container = null;
    }
  }
}
