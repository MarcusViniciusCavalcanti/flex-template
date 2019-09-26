import { Injectable, NgZone } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

import { FlexPlatform } from '../overlay/flex-cdk-mapping.module';
import { FlexLayoutScrollService } from '../../../services/scroll/flex-scroll.service';

@Injectable()
export class FlexScrollDispatcherAdapter extends ScrollDispatcher {
  constructor(ngZone: NgZone, platform: FlexPlatform, protected scrollService: FlexLayoutScrollService) {
    super(ngZone, platform);
  }

  scrolled(auditTimeInMs?: number): Observable<CdkScrollable | void> {
    return this.scrollService.onScroll();
  }
}

