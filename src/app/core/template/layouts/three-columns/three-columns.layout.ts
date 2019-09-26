import { Component } from '@angular/core';

@Component({
  selector: 'app-three-columns-layout',
  styleUrls: ['./three-columns.layout.scss'],
  template: `
    <app-flex-layout windowMode>
      <app-flex-layout-header fixed>
        <app-header></app-header>
      </app-flex-layout-header>
      <app-flex-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="app-flex-menu"></ng-content>
      </app-flex-sidebar>
      <app-flex-layout-column class="small">
      </app-flex-layout-column>
      <app-flex-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </app-flex-layout-column>
      <app-flex-layout-column class="small">
      </app-flex-layout-column>
      <app-flex-layout-footer fixed>
        <app-footer></app-footer>
      </app-flex-layout-footer>
    </app-flex-layout>
  `,
})
export class ThreeColumnsLayoutComponent {}
