import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexMenuModule } from './theme/component/menu/menu.module';
import { TemplateModule } from './core/template/template.module';
import { FlexSidebarModule } from './theme/component/sidebar/sidebar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    TemplateModule.forRoot(),

    FlexSidebarModule.forRoot(),
    FlexMenuModule.forRoot(),

    CoreModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
