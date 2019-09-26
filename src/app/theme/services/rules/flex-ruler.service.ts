import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';

export interface FlexLayoutDimensions {

  clientWidth: number;

  clientHeight: number;

  scrollWidth: number;

  scrollHeight: number;
}

@Injectable()
export class FlexLayoutRulerService {

  private contentDimensionsReq$ = new Subject();

  getDimensions(): Observable<FlexLayoutDimensions> {
    return new Observable<FlexLayoutDimensions>((observer: Subscriber<FlexLayoutDimensions>) => {
      const listener = new Subject<FlexLayoutDimensions>();
      listener.subscribe(observer);
      this.contentDimensionsReq$.next({ listener });

      return () => listener.complete();
    });
  }

  onGetDimensions(): Subject<any> {
    return this.contentDimensionsReq$;
  }
}
