import { Inject, Injectable, NgZone } from '@angular/core';
import { FocusTrap, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { FLEX_DOCUMENT } from '../../../theme.options';
import { FlexFocusTrap } from './flex-focus-trap';

@Injectable()
export class FlexFocusTrapFactoryService extends FocusTrapFactory {
  constructor(
    protected checker: InteractivityChecker,
    protected ngZone: NgZone,
    @Inject(FLEX_DOCUMENT) private document) {
    super(checker, ngZone, document);
  }

  create(element: HTMLElement, deferCaptureElements?: boolean): FlexFocusTrap {
    return new FlexFocusTrap(element, this.checker, this.ngZone, this.document, deferCaptureElements);
  }
}
