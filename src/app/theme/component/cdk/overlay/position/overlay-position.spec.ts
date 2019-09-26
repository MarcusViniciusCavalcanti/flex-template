import { TestBed } from '@angular/core/testing';
import { Component, NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FlexPositionBuilderService } from './overlay-position';
import { FlexThemeModule } from '../../../../flex-theme.module';
import { FlexLayoutModule } from '../../../layout/layout.module';
import { FlexOverlayModule } from '../overlay.module';
import { FlexLayoutComponent } from '../../../layout/layout.component';
import { FlexOverlayService } from '../overlay-service';
import { FlexComponentPortal } from '../flex-cdk-mapping.module';
import { FlexAdjustableConnectedPositionStrategy } from './strategy/flex-adjustable-connected-position-strategy';
import { FlexPosition } from './flex-position';
import { FlexAdjustment } from './flex-adjustment';

@Component({
  template: `portal-component`,
})
export class PortalComponent {}

@NgModule({
  declarations: [ PortalComponent ],
  exports: [ PortalComponent ],
  entryComponents: [ PortalComponent ],
})
export class PortalModule {}

describe('FlexAdjustableConnectedPositionStrategy', () => {
  let strategy: FlexAdjustableConnectedPositionStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FlexThemeModule.forRoot(),
        FlexOverlayModule.forRoot(),
        FlexLayoutModule,
        PortalModule,
        RouterTestingModule.withRoutes([]),
      ],
    });

    // Have to create layout component as it's required for scroll service to work properly.
    // Also it registers overlay container so we don't have to create it manually.
    TestBed.createComponent(FlexLayoutComponent);

    const hostElement = document.createElement('div');
    hostElement.style.width = '10px';
    hostElement.style.height = '10px';
    hostElement.style.backgroundColor = 'red';
    document.body.appendChild(hostElement);

    const positionBuilderService: FlexPositionBuilderService = TestBed.get(FlexPositionBuilderService);
    strategy = positionBuilderService.connectedTo({ nativeElement: hostElement });
  });

  it('should create strategy with position start and adjustment noop', () => {
    const withPositionsSpy = spyOn(strategy, 'withPositions').and.callThrough();

    strategy.position(FlexPosition.START).adjustment(FlexAdjustment.NOOP);

    const overlayService: FlexOverlayService = TestBed.get(FlexOverlayService);
    const overlayRef = overlayService.create({ positionStrategy: strategy });
    overlayRef.attach(new FlexComponentPortal(PortalComponent));

    expect(withPositionsSpy).toHaveBeenCalledTimes(1);
    expect(withPositionsSpy).toHaveBeenCalledWith(jasmine.objectContaining([{
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -15,
    }]));
  });

  it('should create strategy with position end and adjustment noop', () => {
    const withPositionsSpy = spyOn(strategy, 'withPositions').and.callThrough();

    strategy.position(FlexPosition.END).adjustment(FlexAdjustment.NOOP);

    const overlayService: FlexOverlayService = TestBed.get(FlexOverlayService);
    const overlayRef = overlayService.create({ positionStrategy: strategy });
    overlayRef.attach(new FlexComponentPortal(PortalComponent));

    expect(withPositionsSpy).toHaveBeenCalledTimes(1);
    expect(withPositionsSpy).toHaveBeenCalledWith(jasmine.objectContaining([{
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 15,
    }]));
  });
});
