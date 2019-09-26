import { EMPTY, Observable } from 'rxjs';
import { FlexTriggerStrategyBase } from './flex-trigger-strategy-base';

export class FlexNoopTriggerStrategy extends FlexTriggerStrategyBase {
  show$: Observable<Event> = EMPTY;
  hide$: Observable<Event> = EMPTY;
}
