import { ModuleWithProviders, NgModule } from '@angular/core';
import { OverlayContainer, ScrollDispatcher, ScrollStrategyOptions } from '@angular/cdk/overlay';

import { FlexOverlayContainer } from '../overlay/flex-cdk-mapping.module';
import { FlexOverlayContainerAdapter } from './overlay-container-adapter';
import { FlexScrollDispatcherAdapter } from './scroll-dispatcher-adapter';
import { FlexViewportRulerAdapter } from './viewport-ruler-adapter';
import { FlexBlockScrollStrategyAdapter, FlexScrollStrategyOptions } from './block-scroll-strategy-adapter';

@NgModule({})
export class FlexCdkAdapterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexCdkAdapterModule,
      providers: [
        FlexViewportRulerAdapter,
        FlexOverlayContainerAdapter,
        FlexBlockScrollStrategyAdapter,
        { provide: OverlayContainer, useExisting: FlexOverlayContainerAdapter },
        { provide: FlexOverlayContainer, useExisting: FlexOverlayContainerAdapter },
        { provide: ScrollDispatcher, useClass: FlexScrollDispatcherAdapter },
        { provide: ScrollStrategyOptions, useClass: FlexScrollStrategyOptions },
      ],
    } as ModuleWithProviders;
  }
}
