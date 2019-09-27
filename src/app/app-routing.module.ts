import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlexRequestPasswordComponent } from './core/auth/components/request-password/request-password.component';
import { FlexResetPasswordComponent } from './core/auth/components/reset-password/reset-password.component';
import { FlexLogoutComponent } from './core/auth/components/logout/logout.component';
import { FlexRegisterComponent } from './core/auth/components/register/register.component';
import { FlexLoginComponent } from './core/auth/components/login/login.component';
import { FlexAuthComponent } from './core/auth/components/auth.component';


const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('src/app/pages/pages.module').then(m => m.PagesModule),
  },
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
