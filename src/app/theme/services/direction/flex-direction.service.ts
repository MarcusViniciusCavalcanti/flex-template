import { InjectionToken, Optional, Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';

export enum FlexLayoutDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

export const FLEX_LAYOUT_DIRECTION = new InjectionToken<FlexLayoutDirection>('Layout direction');

@Injectable()
export class FlexLayoutDirectionService {
  private $directionChange = new ReplaySubject(1);

  constructor(
    @Optional() @Inject(FLEX_LAYOUT_DIRECTION) private direction = FlexLayoutDirection.LTR,
  ) {
    this.setDirection(direction);
  }

  public isLtr(): boolean {
    return this.direction === FlexLayoutDirection.LTR;
  }

  public isRtl(): boolean {
    return this.direction === FlexLayoutDirection.RTL;
  }

  getDirection(): FlexLayoutDirection {
    return this.direction;
  }

  setDirection(direction: FlexLayoutDirection) {
    this.direction = direction;
    this.$directionChange.next(direction);
  }

  onDirectionChange(): Observable<FlexLayoutDirection> {
    return this.$directionChange.pipe(share<FlexLayoutDirection>());
  }
}
