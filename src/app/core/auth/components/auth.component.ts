import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { FlexAuthService } from '../services/auth.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-flex-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <app-flex-layout>
      <app-flex-layout-column>
        <app-flex-card>
          <app-flex-card-header>
            <nav class="navigation">
              <a href="#" (click)="back()" class="link back-link" aria-label="Back">
                <app-flex-icon icon="arrow-back"></app-flex-icon>
              </a>
            </nav>
          </app-flex-card-header>
          <app-flex-card-body>
            <app-flex-auth-block>
              <router-outlet></router-outlet>
            </app-flex-auth-block>
          </app-flex-card-body>
        </app-flex-card>
      </app-flex-layout-column>
    </app-flex-layout>
  `,
})
export class FlexAuthComponent implements OnDestroy {

  private alive = true;

  subscription: any;

  authenticated = false;
  token = '';

  constructor(protected auth: FlexAuthService, protected location: Location) {

    this.subscription = auth.onAuthenticationChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
