import { HostBinding, Input } from '@angular/core';
import { FlexPosition } from '../position/flex-position';

export abstract class FlexPositionedContainer {
  @Input() position: FlexPosition;

  @HostBinding('class.flex-overlay-top')
  get top(): boolean {
    return this.position === FlexPosition.TOP;
  }

  @HostBinding('class.flex-overlay-right')
  get right(): boolean {
    return this.position === FlexPosition.RIGHT;
  }

  @HostBinding('class.flex-overlay-bottom')
  get bottom(): boolean {
    return this.position === FlexPosition.BOTTOM;
  }

  @HostBinding('class.flex-overlay-left')
  get left(): boolean {
    return this.position === FlexPosition.LEFT;
  }
}
