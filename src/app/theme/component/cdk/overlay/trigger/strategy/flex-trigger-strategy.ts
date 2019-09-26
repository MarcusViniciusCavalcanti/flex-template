import { Observable } from 'rxjs';

export interface FlexTriggerStrategy {
  show$: Observable<never | Event>;
  hide$: Observable<never | Event>;

  destroy();
}
