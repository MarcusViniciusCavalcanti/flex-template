import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FLEX_AUTH_OPTIONS, FlexAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { FlexAuthService } from '../../services/auth.service';
import { FlexAuthResult } from '../../services/auth-result';

@Component({
  selector: 'app-flex-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexLoginComponent {

  redirectDelay = 0;
  showMessages: any = {};
  strategy = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted = false;
  socialLinks: FlexAuthSocialLink[] = [];
  rememberMe = false;

  constructor(protected service: FlexAuthService,
              @Inject(FLEX_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: FlexAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
