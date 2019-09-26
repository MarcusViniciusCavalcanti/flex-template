import { Injectable } from '@angular/core';

import { FlexOverlayContainer } from '../overlay/flex-cdk-mapping.module';


@Injectable()
export class FlexOverlayContainerAdapter extends FlexOverlayContainer {
  protected container: HTMLElement;

  setContainer(container: HTMLElement) {
    this.container = container;
  }

  clearContainer() {
    this.container = null;
    this._containerElement = null;
  }

  protected _createContainer(): void {
    const container = this._document.createElement('div');

    container.classList.add('cdk-overlay-container');
    this.container.appendChild(container);
    this._containerElement = container;
  }
}
