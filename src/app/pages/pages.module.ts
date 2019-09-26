import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { TemplateModule } from '../core/template/template.module';
import { FlexMenuModule } from '../theme/component/menu/menu.module';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TemplateModule,
    FlexMenuModule
  ]
})
export class PagesModule { }
