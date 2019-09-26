import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexOverlayContainerComponent } from './overlay-container';
import { FlexOverlayModule } from '../overlay.module';
import { FlexComponentPortal } from '../flex-cdk-mapping.module';

@Component({
  template: `
    <app-flex-overlay-container></app-flex-overlay-container>
  `,
})
export class OverlayContainerTestComponent {
  @ViewChild(FlexOverlayContainerComponent, { static: false }) overlayContainer: FlexOverlayContainerComponent;
}

@Component({
  template: `{{ contextProperty }}`,
})
export class OverlayTestComponent implements OnInit {
  contextProperty;

  isFirstOnChangesCall = true;
  contextPropertyValueOnFirstCdRun;
  ngOnInit() {
    if (this.isFirstOnChangesCall) {
      this.contextPropertyValueOnFirstCdRun = this.contextProperty;
      this.isFirstOnChangesCall = false;
    }
  }
}

@NgModule({
  imports: [ FlexOverlayModule ],
  declarations: [ OverlayContainerTestComponent, OverlayTestComponent ],
  entryComponents: [ OverlayTestComponent ],
})
export class OverlayTestModule {}

describe('FlexOverlayContainerComponent', () => {
  let fixture: ComponentFixture<OverlayContainerTestComponent>;
  let overlayContainer: FlexOverlayContainerComponent;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ OverlayTestModule ] });

    fixture = TestBed.createComponent(OverlayContainerTestComponent);
    fixture.detectChanges();
    overlayContainer = fixture.componentInstance.overlayContainer;
  });

  it('should set context before change detection run', () => {
    const context = { contextProperty: 'contextProperty' };
    const portal: FlexComponentPortal<OverlayTestComponent> = new FlexComponentPortal(OverlayTestComponent);
    const portalRef = overlayContainer.attachComponentPortal(portal, context);

    expect(portalRef.instance.contextPropertyValueOnFirstCdRun).toEqual(context.contextProperty);
  });
});
