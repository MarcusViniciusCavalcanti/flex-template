import { fromEvent as observableFromEvent, merge as observableMerge, Observable } from 'rxjs';
import { debounceTime, delay, filter, repeat, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { FlexTriggerStrategyBase } from './flex-trigger-strategy-base';

export class FlexHoverTriggerStrategy extends FlexTriggerStrategyBase {

  show$: Observable<Event> = observableFromEvent<Event>(this.host, 'mouseenter')
    .pipe(
      filter(() => !this.container()),
      delay(100),
      takeUntil(
        observableMerge(
          observableFromEvent(this.host, 'mouseleave'),
          this.destroyed$,
        ),
      ),
      repeat(),
    );

  hide$: Observable<Event> = observableFromEvent<Event>(this.host, 'mouseleave')
    .pipe(
      switchMap(() => observableFromEvent<Event>(this.document, 'mousemove')
        .pipe(
          debounceTime(100),
          takeWhile(() => !!this.container()),
          filter(event => this.isNotOnHostOrContainer(event)),
        ),
      ),
      takeUntil(this.destroyed$),
    );
}
