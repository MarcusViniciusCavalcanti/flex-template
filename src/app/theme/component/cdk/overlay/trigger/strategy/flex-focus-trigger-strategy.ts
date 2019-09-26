import { fromEvent as observableFromEvent, merge as observableMerge, Observable } from 'rxjs';
import { debounceTime, filter, repeat, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { FlexTriggerStrategyBase } from './flex-trigger-strategy-base';

export class FlexFocusTriggerStrategy extends FlexTriggerStrategyBase {

  protected focusOut$: Observable<Event> = observableFromEvent<Event>(this.host, 'focusout')
    .pipe(
      switchMap(() => observableFromEvent<Event>(this.document, 'focusin')
        .pipe(
          takeWhile(() => !!this.container()),
          filter(event => this.isNotOnHostOrContainer(event)),
        ),
      ),
      takeUntil(this.destroyed$),
    );

  protected clickIn$: Observable<Event> = observableFromEvent<Event>(this.host, 'click')
    .pipe(
      filter(() => !this.container()),
      takeUntil(this.destroyed$),
    );

  protected clickOut$: Observable<Event> = observableFromEvent<Event>(this.document, 'click')
    .pipe(
      filter(() => !!this.container()),
      filter(event => this.isNotOnHostOrContainer(event)),
      takeUntil(this.destroyed$),
    );

  protected tabKeyPress$: Observable<Event> = observableFromEvent<Event>(this.document, 'keydown')
    .pipe(
      filter((event: KeyboardEvent) => event.keyCode === 9),
      filter(() => !!this.container()),
      takeUntil(this.destroyed$),
    );

  show$: Observable<Event> = observableMerge(observableFromEvent<Event>(this.host, 'focusin'), this.clickIn$)
    .pipe(
      filter(() => !this.container()),
      debounceTime(100),
      takeUntil(
        observableMerge(
          observableFromEvent(this.host, 'focusout'),
          this.destroyed$,
        ),
      ),
      repeat(),
    );

  hide$ = observableMerge(this.focusOut$, this.tabKeyPress$, this.clickOut$)
    .pipe(takeUntil(this.destroyed$));
}
