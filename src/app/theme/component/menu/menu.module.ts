import { ModuleWithProviders, NgModule } from '@angular/core';

import { FlexSharedModule } from '../shared/shared.module';
import { FlexMenuComponent, FlexMenuItemComponent } from './menu.component';
import { FlexMenuInternalService, FlexMenuService } from './menu.service';
import { FlexIconModule } from '../icon/icon.module';

const flexMenuComponents = [ FlexMenuComponent, FlexMenuItemComponent ];

const NB_MENU_PROVIDERS = [ FlexMenuService, FlexMenuInternalService ];

@NgModule({
  imports: [ FlexSharedModule, FlexIconModule ],
  declarations: [...flexMenuComponents],
  exports: [...flexMenuComponents],
})
export class FlexMenuModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexMenuModule,
      providers: [
        ...NB_MENU_PROVIDERS,
      ],
    } as ModuleWithProviders;
  }
}
