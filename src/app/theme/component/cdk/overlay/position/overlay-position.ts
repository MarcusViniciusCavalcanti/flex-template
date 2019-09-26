import { ElementRef, Inject, Injectable } from '@angular/core';

import { FLEX_DOCUMENT } from '../../../../theme.options';
import { FlexPlatform } from '../flex-cdk-mapping.module';
import { FlexOverlayContainerAdapter } from '../../adapter/overlay-container-adapter';
import { FlexViewportRulerAdapter } from '../../adapter/viewport-ruler-adapter';
import { FlexGlobalPositionStrategy } from './strategy/flex-global-position-strategy';
import { FlexAdjustableConnectedPositionStrategy } from './strategy/flex-adjustable-connected-position-strategy';

@Injectable()
export class FlexPositionBuilderService {
  constructor(@Inject(FLEX_DOCUMENT) protected document,
              protected viewportRuler: FlexViewportRulerAdapter,
              protected platform: FlexPlatform,
              protected overlayContainer: FlexOverlayContainerAdapter) {
  }

  global(): FlexGlobalPositionStrategy {
    return new FlexGlobalPositionStrategy();
  }

  connectedTo(elementRef: ElementRef): FlexAdjustableConnectedPositionStrategy {
    return new FlexAdjustableConnectedPositionStrategy(
      elementRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer,
    )
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
