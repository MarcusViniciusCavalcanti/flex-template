import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Styles configured
import { DEFAULT_THEME } from './styles/ts/theme.default';
import { COSMIC_THEME } from './styles/ts/theme.cosmic';
import { CORPORATE_THEME } from './styles/ts/theme.corporate';
import { DARK_THEME } from './styles/ts/theme.dark';

// theme flex
import { FlexMenuModule } from '../../theme/component/menu/menu.module';
import { FlexLayoutModule } from '../../theme/component/layout/layout.module';
import { FlexThemeModule } from '../../theme/flex-theme.module';
import { FlexSidebarModule } from '../../theme/component/sidebar/sidebar.module';
import { FlexIconModule } from '../../theme/component/icon/icon.module';

// template componentes
import { OneColumnLayoutComponent, ThreeColumnsLayoutComponent, TwoColumnsLayoutComponent, } from './layouts';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TinyMCEComponent } from './components/tiny-mce/tiny-mce.component';

// pipes
import { CapitalizePipe, NumberWithCommasPipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import { EvaIconsModule } from '../../theme/eva-icons/eva-icons.module';

const FLEX_MODULES = [
  FlexLayoutModule,
  FlexMenuModule,
  FlexSidebarModule,
  FlexIconModule,
];

const LAYOUT_COMPONENTS = [
  OneColumnLayoutComponent,
  TwoColumnsLayoutComponent,
  ThreeColumnsLayoutComponent,
];

const PIPES_TEMPLATE = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
];

@NgModule({
  declarations: [
    ...LAYOUT_COMPONENTS,
    ...COMPONENTS,
    ... PIPES_TEMPLATE
  ],
  imports: [
    CommonModule,
    ...FLEX_MODULES,
    EvaIconsModule,
  ],
  exports: [
    ...LAYOUT_COMPONENTS,
    ...PIPES_TEMPLATE
  ]
})
export class TemplateModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TemplateModule,
      providers: [
        ...FlexThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers,
      ],
    } as ModuleWithProviders;
  }
}
