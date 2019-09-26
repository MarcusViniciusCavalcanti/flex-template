import { fromEvent as observableFromEvent, merge as observableMerge, Observable } from 'rxjs';
import { delay, repeat, takeUntil } from 'rxjs/operators';
import { FlexTriggerStrategyBase } from './flex-trigger-strategy-base';

export class FlexHintTriggerStrategy extends FlexTriggerStrategyBase {
  show$: Observable<Event> = observableFromEvent<Event>(this.host, 'mouseenter')
    .pipe(
      delay(100),
      takeUntil(
        observableMerge(
          observableFromEvent(this.host, 'mouseleave'),
          this.destroyed$,
        ),
      ),

      repeat(),
    );

  hide$: Observable<Event> = observableFromEvent(this.host, 'mouseleave')
    .pipe(takeUntil(this.destroyed$));
}
