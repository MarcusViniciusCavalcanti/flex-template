import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FLEX_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';
import { FlexAuthService } from '../../services/auth.service';
import { FlexAuthResult } from '../../services/auth-result';

@Component({
  selector: 'app-flex-logout',
  templateUrl: './logout.component.html',
})
export class FlexLogoutComponent implements OnInit {

  redirectDelay = 0;
  strategy = '';

  constructor(protected service: FlexAuthService,
              @Inject(FLEX_AUTH_OPTIONS) protected options = {},
              protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit(): void {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {
    this.service.logout(strategy).subscribe((result: FlexAuthResult) => {

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
