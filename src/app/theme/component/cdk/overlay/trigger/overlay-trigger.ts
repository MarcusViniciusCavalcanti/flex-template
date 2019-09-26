import { ComponentRef, Inject, Injectable } from '@angular/core';
import { EMPTY, fromEvent as observableFromEvent, merge as observableMerge, Observable, Subject } from 'rxjs';
import { debounceTime, delay, filter, map, repeat, share, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { FLEX_DOCUMENT } from '../../../../theme.options';
import { FlexTrigger } from './flex-trigger';
import { FlexTriggerStrategy } from './strategy/flex-trigger-strategy';
import { FlexClickTriggerStrategy } from './strategy/flex-click-trigger-strategy';
import { FlexHintTriggerStrategy } from './strategy/flex-hint-trigger-strategy';
import { FlexHoverTriggerStrategy } from './strategy/flex-hover-trigger-strategy';
import { FlexFocusTriggerStrategy } from './strategy/flex-focus-trigger-strategy';
import { FlexNoopTriggerStrategy } from './strategy/flex-noop-trigger-strategy';

@Injectable()
export class FlexTriggerStrategyBuilderService {

  protected hostElement: HTMLElement;
  protected componentContainer: () => ComponentRef<any>;
  protected actionTrigger: FlexTrigger;

  constructor(@Inject(FLEX_DOCUMENT) protected document) {}

  trigger(trigger: FlexTrigger): this {
    this.actionTrigger = trigger;
    return this;
  }

  host(host: HTMLElement): this {
    this.hostElement = host;
    return this;
  }

  container(container: () => ComponentRef<any>): this {
    this.componentContainer = container;
    return this;
  }

  build(): FlexTriggerStrategy {
    switch (this.actionTrigger) {
      case FlexTrigger.CLICK:
        return new FlexClickTriggerStrategy(this.document, this.hostElement, this.componentContainer);
      case FlexTrigger.HINT:
        return new FlexHintTriggerStrategy(this.document, this.hostElement, this.componentContainer);
      case FlexTrigger.HOVER:
        return new FlexHoverTriggerStrategy(this.document, this.hostElement, this.componentContainer);
      case FlexTrigger.FOCUS:
        return new FlexFocusTriggerStrategy(this.document, this.hostElement, this.componentContainer);
      case FlexTrigger.NOOP:
        return new FlexNoopTriggerStrategy(this.document, this.hostElement, this.componentContainer);
      default:
        throw new Error('Trigger have to be provided');
    }
  }
}
