import { SimpleChange } from '@angular/core';

export class FlexDynamicOverlayChange extends SimpleChange {

  constructor(previousValue: any, currentValue: any, firstChange: boolean = false) {
    super(previousValue, currentValue, firstChange);
  }

  isChanged(): boolean {
    return this.currentValue !== this.previousValue;
  }
}
