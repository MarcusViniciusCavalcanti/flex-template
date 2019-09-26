import { ElementRef, Injectable, Type } from '@angular/core';

import { FlexPositionBuilderService, } from '../../position/overlay-position';
import { FlexRenderableContainer } from '../../container/flex-renderable-container';
import { FlexOverlayContent } from '../../overlay-service';
import { FlexDynamicOverlay } from '../flex-dynamic-overlay';
import { FlexDynamicOverlayChange } from './flex-dynamic-overlay-change';
import { FlexPosition } from '../../position/flex-position';
import { FlexAdjustment } from '../../position/flex-adjustment';
import { FlexAdjustableConnectedPositionStrategy } from '../../position/strategy/flex-adjustable-connected-position-strategy';
import { FlexTrigger } from '../../trigger/flex-trigger';
import { FlexTriggerStrategy } from '../../trigger/strategy/flex-trigger-strategy';
import { FlexTriggerStrategyBuilderService } from '../../trigger/overlay-trigger';

@Injectable()
export class FlexDynamicOverlayHandler {

  protected renderableComponentType: Type<FlexRenderableContainer>;
  protected elementRefHost: ElementRef;
  protected renderableContext = {};
  protected overlayContent: FlexOverlayContent;
  protected actionTrigger: FlexTrigger = FlexTrigger.NOOP;
  protected pos: FlexPosition = FlexPosition.TOP;
  protected adj: FlexAdjustment = FlexAdjustment.NOOP;
  protected off = 15;

  protected dynamicOverlay: FlexDynamicOverlay;
  protected triggerStrategy: FlexTriggerStrategy;

  protected positionStrategy: FlexAdjustableConnectedPositionStrategy;

  protected changes: { [key: string]: FlexDynamicOverlayChange } = {};

  constructor(private positionBuilder: FlexPositionBuilderService,
              private triggerStrategyBuilder: FlexTriggerStrategyBuilderService,
              private dynamicOverlayService: FlexDynamicOverlay) {
  }

  host(host: ElementRef) {
    this.changes.host = new FlexDynamicOverlayChange(this.elementRefHost, host);
    this.elementRefHost = host;
    return this;
  }

  trigger(trigger: FlexTrigger) {
    this.changes.trigger = new FlexDynamicOverlayChange(this.actionTrigger, trigger);
    this.actionTrigger = trigger;
    return this;
  }

  position(position: FlexPosition) {
    this.changes.position = new FlexDynamicOverlayChange(this.pos, position);
    this.pos = position;
    return this;
  }

  adjustment(adjustment: FlexAdjustment) {
    this.changes.adjustment = new FlexDynamicOverlayChange(this.adj, adjustment);
    this.adj = adjustment;
    return this;
  }

  componentType(componentType: Type<FlexRenderableContainer>) {
    this.changes.componentType = new FlexDynamicOverlayChange(this.renderableComponentType, componentType);
    this.renderableComponentType = componentType;
    return this;
  }

  content(content: FlexOverlayContent) {
    this.changes.content = new FlexDynamicOverlayChange(this.overlayContent, content);
    this.overlayContent = content;
    return this;
  }

  context(context: {}) {
    this.changes.context = new FlexDynamicOverlayChange(this.renderableContext, context);
    this.renderableContext = context;
    return this;
  }

  offset(offset: number) {
    this.changes.offset = new FlexDynamicOverlayChange(this.off, offset);
    this.off = offset;
    return this;
  }

  build() {
    if (!this.renderableComponentType || !this.elementRefHost) {
      throw Error(`FlexDynamicOverlayHandler: at least 'componentType' and 'host' should be
      passed before building a dynamic overlay.`);
    }
    this.dynamicOverlay = this.dynamicOverlayService.create(
      this.renderableComponentType,
      this.overlayContent,
      this.renderableContext,
      this.createPositionStrategy(),
    );

    this.connect();
    this.clearChanges();

    return this.dynamicOverlay;
  }

  rebuild() {
    if (!this.dynamicOverlay) {
      return;
    }

    if (this.isPositionStrategyUpdateRequired()) {
      this.dynamicOverlay.setPositionStrategy(this.createPositionStrategy());
    }

    if (this.isTriggerStrategyUpdateRequired()) {
      this.connect();
    }

    if (this.isContainerRerenderRequired()) {
      this.dynamicOverlay.setContentAndContext(this.overlayContent, this.renderableContext);
    }

    if (this.isComponentTypeUpdateRequired()) {
      this.dynamicOverlay.setComponent(this.renderableComponentType);
    }

    this.clearChanges();
    return this.dynamicOverlay;
  }

  connect() {
    if (!this.dynamicOverlay) {
      throw new Error(`FlexDynamicOverlayHandler: cannot connect to DynamicOverlay
      as it is not created yet. Call build() first`);
    }
    this.disconnect();
    this.subscribeOnTriggers(this.dynamicOverlay);
  }

  disconnect() {
    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }
  }

  destroy() {
    this.disconnect();
    this.clearChanges();
    if (this.dynamicOverlay) {
      this.dynamicOverlay.dispose();
    }
  }

  protected createPositionStrategy() {
    return this.positionBuilder
      .connectedTo(this.elementRefHost)
      .position(this.pos)
      .adjustment(this.adj)
      .offset(this.off);
  }

  protected subscribeOnTriggers(dynamicOverlay: FlexDynamicOverlay) {
    this.triggerStrategy = this.triggerStrategyBuilder
      .trigger(this.actionTrigger)
      .host(this.elementRefHost.nativeElement)
      .container(() => dynamicOverlay.getContainer())
      .build();

    this.triggerStrategy.show$.subscribe(() => dynamicOverlay.show());
    this.triggerStrategy.hide$.subscribe(() => dynamicOverlay.hide());
  }

  protected isContainerRerenderRequired() {
    return this.isContentUpdated()
      || this.isContextUpdated()
      || this.isPositionStrategyUpdateRequired();
  }

  protected isPositionStrategyUpdateRequired(): boolean {
    return this.isAdjustmentUpdated() || this.isPositionUpdated() || this.isOffsetUpdated() || this.isHostUpdated();
  }

  protected isTriggerStrategyUpdateRequired(): boolean {
    return this.isTriggerUpdated() || this.isHostUpdated();
  }

  protected isComponentTypeUpdateRequired(): boolean {
    return this.isComponentTypeUpdated();
  }

  protected isComponentTypeUpdated(): boolean {
    return this.changes.componentType && this.changes.componentType.isChanged();
  }

  protected isContentUpdated(): boolean {
    return this.changes.content && this.changes.content.isChanged();
  }

  protected isContextUpdated(): boolean {
    return this.changes.context && this.changes.context.isChanged();
  }

  protected isAdjustmentUpdated(): boolean {
    return this.changes.adjustment && this.changes.adjustment.isChanged();
  }

  protected isPositionUpdated(): boolean {
    return this.changes.position && this.changes.position.isChanged();
  }

  protected isHostUpdated(): boolean {
    return this.changes.host && this.changes.host.isChanged();
  }

  protected isTriggerUpdated(): boolean {
    return this.changes.trigger && this.changes.trigger.isChanged();
  }

  protected isOffsetUpdated(): boolean {
    return this.changes.offset && this.changes.offset.isChanged();
  }

  protected clearChanges() {
    this.changes = {};
  }
}
