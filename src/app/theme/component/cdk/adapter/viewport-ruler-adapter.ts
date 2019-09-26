import { Injectable, NgZone } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/overlay';
import { map } from 'rxjs/operators';

import { FlexPlatform } from '../overlay/flex-cdk-mapping.module';
import { FlexLayoutRulerService } from '../../../services/rules/flex-ruler.service';
import { FlexLayoutScrollService, FlexScrollPosition } from '../../../services/scroll/flex-scroll.service';

@Injectable()
export class FlexViewportRulerAdapter extends ViewportRuler {
  constructor(platform: FlexPlatform, ngZone: NgZone,
              protected ruler: FlexLayoutRulerService,
              protected scroll: FlexLayoutScrollService) {
    super(platform, ngZone);
  }

  getViewportSize(): Readonly<{ width: number; height: number; }> {
    let res;
    this.ruler.getDimensions()
      .pipe(map(dimensions => ({ width: dimensions.clientWidth, height: dimensions.clientHeight })))
      .subscribe(rect => res = rect);
    return res;
  }

  getViewportScrollPosition(): { left: number; top: number } {
    let res;

    this.scroll.getPosition()
      .pipe(map((position: FlexScrollPosition) => ({ top: position.y, left: position.x })))
      .subscribe(position => res = position);
    return res;
  }
}
