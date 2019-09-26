import { FocusTrap, InteractivityChecker } from '@angular/cdk/a11y';
import { NgZone } from '@angular/core';

export class FlexFocusTrap extends FocusTrap {
  protected previouslyFocusedElement: HTMLElement;

  constructor(
    protected element: HTMLElement,
    protected checker: InteractivityChecker,
    protected ngZone: NgZone,
    protected document: Document,
    deferAnchors) {
    super(element, checker, ngZone, document, deferAnchors);
    this.savePreviouslyFocusedElement();
  }

  restoreFocus() {
    this.previouslyFocusedElement.focus();
    this.destroy();
  }

  blurPreviouslyFocusedElement() {
    this.previouslyFocusedElement.blur();
  }

  protected savePreviouslyFocusedElement() {
    this.previouslyFocusedElement = this.document.activeElement as HTMLElement;
  }
}
