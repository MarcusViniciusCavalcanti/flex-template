import { NgModule } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { FlexPlatform } from './platform-service';

@NgModule({
  providers: [
    { provide: FlexPlatform, useExisting: Platform },
  ],
})
export class FlexPlatformModule extends PlatformModule {}
