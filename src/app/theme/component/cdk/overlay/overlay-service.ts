import { ComponentFactoryResolver, ComponentRef, Injectable, TemplateRef, Type } from '@angular/core';

import {
  FlexComponentPortal,
  FlexComponentType,
  FlexOverlay,
  FlexOverlayConfig,
  FlexOverlayRef,
  FlexScrollStrategyOptions,
} from './flex-cdk-mapping.module';
import { FlexLayoutDirectionService } from '../../../services/direction/flex-direction.service';


export type FlexOverlayContent = Type<any> | TemplateRef<any> | string;

export function patch<T>(container: ComponentRef<T>, containerContext: {}): ComponentRef<T> {
  Object.assign(container.instance, containerContext);
  container.changeDetectorRef.detectChanges();
  return container;
}

export function createContainer<T>(
  ref: FlexOverlayRef,
  container: FlexComponentType<T>,
  context: {},
  componentFactoryResolver?: ComponentFactoryResolver,
  ): ComponentRef<T> {
  const containerRef = ref.attach(new FlexComponentPortal(container, null, null, componentFactoryResolver));
  patch(containerRef, context);
  return containerRef;
}

@Injectable()
export class FlexOverlayService {
  constructor(protected overlay: FlexOverlay, protected layoutDirection: FlexLayoutDirectionService) {
  }

  get scrollStrategies(): FlexScrollStrategyOptions {
    return this.overlay.scrollStrategies;
  }

  create(config?: FlexOverlayConfig): FlexOverlayRef {
    const overlayRef = this.overlay.create(config);
    this.layoutDirection.onDirectionChange()
      .subscribe(dir => overlayRef.setDirection(dir));
    return overlayRef;
  }
}
