import { ModuleWithProviders, NgModule } from '@angular/core';

import { FlexSharedModule } from '../../shared/shared.module';
import { FlexA11yModule } from '../a11y/a11y.module';
import { FlexCdkMappingModule } from './flex-cdk-mapping.module';
import { FlexPositionBuilderService } from './position/overlay-position';
import { FlexOverlayContainerComponent } from './container/overlay-container';
import { FlexOverlayService } from './overlay-service';
import { FlexCdkAdapterModule } from '../adapter/adapter.module';
import { FlexPositionHelper } from '../../../../helpers/position/position-helper';
import { FlexTriggerStrategyBuilderService } from './trigger/overlay-trigger';

@NgModule({
  imports: [
    FlexCdkMappingModule,
    FlexSharedModule,
  ],
  declarations: [ FlexOverlayContainerComponent ],
  exports: [
    FlexCdkMappingModule,
    FlexCdkAdapterModule,
    FlexOverlayContainerComponent,
  ],
})
export class FlexOverlayModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexOverlayModule,
      providers: [
        FlexPositionBuilderService,
        FlexTriggerStrategyBuilderService,
        FlexOverlayService,
        FlexPositionHelper,
        ...FlexCdkMappingModule.forRoot().providers,
        ...FlexCdkAdapterModule.forRoot().providers,
        ...FlexA11yModule.forRoot().providers,
      ],
    } as ModuleWithProviders;
  }
}
