/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Routes } from '@angular/router';

import { FlexAuthComponent } from './components/auth.component';
import { FlexLoginComponent } from './components/login/login.component';
import { FlexRegisterComponent } from './components/register/register.component';
import { FlexLogoutComponent } from './components/logout/logout.component';
import { FlexRequestPasswordComponent } from './components/request-password/request-password.component';
import { FlexResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: FlexAuthComponent,
    children: [
      {
        path: '',
        component: FlexLoginComponent,
      },
      {
        path: 'login',
        component: FlexLoginComponent,
      },
      {
        path: 'register',
        component: FlexRegisterComponent,
      },
      {
        path: 'logout',
        component: FlexLogoutComponent,
      },
      {
        path: 'request-password',
        component: FlexRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: FlexResetPasswordComponent,
      },
    ],
  },
];
