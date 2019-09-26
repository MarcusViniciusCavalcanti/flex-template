import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';

export interface FlexScrollPosition {
  x: number;
  y: number;
}

@Injectable()
export class FlexLayoutScrollService {

  private scrollPositionReq$ = new Subject<any>();
  private manualScroll$ = new Subject<FlexScrollPosition>();
  private scroll$ = new Subject<any>();
  private scrollable$ = new Subject<boolean>();

  getPosition(): Observable<FlexScrollPosition> {
    return new Observable((observer: Subscriber<FlexScrollPosition>) => {
      const listener = new Subject<FlexScrollPosition>();
      listener.subscribe(observer);
      this.scrollPositionReq$.next({ listener });

      return () => listener.complete();
    });
  }

  scrollTo(x: number = null, y: number = null) {
    this.manualScroll$.next({ x, y });
  }

  onScroll() {
    return this.scroll$.pipe(share<any>());
  }

  onManualScroll(): Observable<FlexScrollPosition> {
    return this.manualScroll$.pipe(share<FlexScrollPosition>());
  }

  onGetPosition(): Subject<any> {
    return this.scrollPositionReq$;
  }

  onScrollableChange(): Observable<boolean> {
    return this.scrollable$.pipe(share());
  }

  fireScrollChange(event: any) {
    this.scroll$.next(event);
  }

  scrollable(scrollable: boolean) {
    this.scrollable$.next(scrollable);
  }
}
