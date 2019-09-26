import { Inject, Injectable, NgZone } from '@angular/core';
import { BlockScrollStrategy, ScrollDispatcher, ScrollStrategyOptions } from '@angular/cdk/overlay';

import { FlexViewportRulerAdapter } from './viewport-ruler-adapter';
import { FlexLayoutScrollService } from '../../../services/scroll/flex-scroll.service';
import { FLEX_DOCUMENT } from '../../../theme.options';

@Injectable()
export class FlexBlockScrollStrategyAdapter extends BlockScrollStrategy {
  constructor(@Inject(FLEX_DOCUMENT) document: any,
              viewportRuler: FlexViewportRulerAdapter,
              protected scrollService: FlexLayoutScrollService) {
    super(viewportRuler, document);
  }

  enable() {
    super.enable();
    this.scrollService.scrollable(false);
  }

  disable() {
    super.disable();
    this.scrollService.scrollable(true);
  }
}

export class FlexScrollStrategyOptions extends ScrollStrategyOptions {
  constructor(protected scrollService: FlexLayoutScrollService,
              protected scrollDispatcher: ScrollDispatcher,
              protected viewportRuler: FlexViewportRulerAdapter,
              protected ngZone: NgZone,
              @Inject(FLEX_DOCUMENT) protected document) {
    super(scrollDispatcher, viewportRuler, ngZone, document);
  }

  block = () => new FlexBlockScrollStrategyAdapter(this.document, this.viewportRuler, this.scrollService);
}
