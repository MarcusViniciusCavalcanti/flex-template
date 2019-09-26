import {
  Directive,
  Injectable,
  ModuleWithProviders,
  NgModule,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  CdkPortal,
  CdkPortalOutlet,
  ComponentPortal,
  Portal,
  PortalInjector,
  PortalModule,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  ComponentType,
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayModule,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';


@Directive({ selector: '[appPortal]' })
export class FlexPortalDirective extends CdkPortal {
}

@Directive({ selector: '[appPortalOutlet]' })
export class FlexPortalOutletDirective extends CdkPortalOutlet {
}

export class FlexComponentPortal<T = any> extends ComponentPortal<T> {
}

@Injectable()
export class FlexOverlay extends Overlay {
}

@Injectable()
export class FlexPlatform extends Platform {
}

@Injectable()
export class FlexOverlayPositionBuilder extends OverlayPositionBuilder {
}

export class FlexTemplatePortal<T = any> extends TemplatePortal<T> {
  constructor(template: TemplateRef<T>, viewContainerRef?: ViewContainerRef, context?: T) {
    super(template, viewContainerRef, context);
  }
}

export class FlexOverlayContainer extends OverlayContainer {
}

export class FlexFlexibleConnectedPositionStrategy extends FlexibleConnectedPositionStrategy {
}

export class FlexPortalInjector extends PortalInjector {
}

export type FlexPortal<T = any> = Portal<T>;
export type FlexOverlayRef = OverlayRef;
export type FlexComponentType<T = any> = ComponentType<T>;
export type FlexPositionStrategy = PositionStrategy;
export type FlexConnectedPosition = ConnectedPosition;
export type FlexConnectedOverlayPositionChange = ConnectedOverlayPositionChange;
export type FlexConnectionPositionPair = ConnectionPositionPair;
export type FlexOverlayConfig = OverlayConfig;
export type FlexScrollStrategyOptions = ScrollStrategyOptions;
export type FlexScrollStrategy = ScrollStrategy;

const CDK_MODULES = [ OverlayModule, PortalModule ];

@NgModule({
  imports: [...CDK_MODULES],
  exports: [
    ...CDK_MODULES,
    FlexPortalDirective,
    FlexPortalOutletDirective,
  ],
  declarations: [FlexPortalDirective, FlexPortalOutletDirective],
})
export class FlexCdkMappingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexCdkMappingModule,
      providers: [
        FlexOverlay,
        FlexPlatform,
        FlexOverlayPositionBuilder,
      ],
    } as ModuleWithProviders;
  }
}
