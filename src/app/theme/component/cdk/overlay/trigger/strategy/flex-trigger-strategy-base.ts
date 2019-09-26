import { Observable, Subject } from 'rxjs';
import { ComponentRef } from '@angular/core';
import { FlexTriggerStrategy } from './flex-trigger-strategy';

export abstract class FlexTriggerStrategyBase implements FlexTriggerStrategy {

  protected destroyed$ = new Subject();

  abstract show$: Observable<Event>;
  abstract hide$: Observable<Event>;

  destroy() {
    this.destroyed$.next();
  }

  protected isNotOnHostOrContainer(event: Event): boolean {
    return !this.isOnHost(event) && !this.isOnContainer(event);
  }

  protected isOnHostOrContainer(event: Event): boolean {
    return this.isOnHost(event) || this.isOnContainer(event);
  }

  protected isOnHost({ target }: Event): boolean {
    return this.host.contains(target as Node);
  }

  protected isOnContainer({ target }: Event): boolean {
    return this.container() && this.container().location.nativeElement.contains(target);
  }

  constructor(protected document: Document, protected host: HTMLElement, protected container: () => ComponentRef<any>) {
  }
}
