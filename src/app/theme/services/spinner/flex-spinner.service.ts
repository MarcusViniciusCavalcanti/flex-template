import { Injectable, Inject } from '@angular/core';
import { FLEX_DOCUMENT } from '../../theme.options';

@Injectable()
export class FlexSpinnerService {

  private loaders: Promise<any>[] = [];
  private selector = 'app-flex-global-spinner';

  constructor(@Inject(FLEX_DOCUMENT) private document) {}

  registerLoader(method: Promise<any>): void {
    this.loaders.push(method);
  }

  clear(): void {
    this.loaders = [];
  }

  load(): void {
    this.showSpinner();
    this.executeAll();
  }

  private executeAll(done = () => {}): void {
    Promise.all(this.loaders).then((values) => {
      this.hideSpinner();
      done.call(null, values);
    })
      .catch((error) => {
        // TODO: promisse????
        console.error(error);
      });
  }

  private showSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style['display'] = 'block';
    }
  }

  private hideSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style['display'] = 'none';
    }
  }

  private getSpinnerElement() {
    return this.document.getElementById(this.selector);
  }
}
