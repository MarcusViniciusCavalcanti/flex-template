import { fromEvent as observableFromEvent, Observable } from 'rxjs';
import { filter, map, share, takeUntil } from 'rxjs/operators';
import { FlexTriggerStrategyBase } from './flex-trigger-strategy-base';

export class FlexClickTriggerStrategy extends FlexTriggerStrategyBase {

  protected click$: Observable<[boolean, Event]> = observableFromEvent<Event>(this.document, 'click')
    .pipe(
      map((event: Event) => [!this.container() && this.isOnHost(event), event] as [boolean, Event]),
      share(),
      takeUntil(this.destroyed$),
    );

  readonly show$: Observable<Event> = this.click$
    .pipe(
      filter(([shouldShow]) => shouldShow),
      map(([, event]) => event),
      takeUntil(this.destroyed$),
    );

  readonly hide$: Observable<Event> = this.click$
    .pipe(
      filter(([shouldShow, event]) => !shouldShow && !this.isOnContainer(event)),
      map(([, event]) => event),
      takeUntil(this.destroyed$),
    );
}
