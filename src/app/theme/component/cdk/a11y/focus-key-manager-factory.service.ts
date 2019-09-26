import { QueryList } from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';

export type FlexFocusableOption = FocusableOption;
export class FlexFocusKeyManager<T> extends FocusKeyManager<T> {}

export class FlexFocusKeyManagerFactoryService<T extends FlexFocusableOption> {
  create(items: QueryList<T> | T[]): FlexFocusKeyManager<T> {
    return new FlexFocusKeyManager<T>(items);
  }
}
