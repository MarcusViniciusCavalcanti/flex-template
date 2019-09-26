import { Component } from '@angular/core';
import { TestBed, ComponentFixture, flush, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FlexThemeModule } from '../../flex-theme.module';
import { FlexLayoutModule } from './layout.module';
import { FlexLayoutComponent } from './layout.component';
import { FlexLayoutScrollService } from '../../services/scroll/flex-scroll.service';
import { FlexLayoutDirection, FlexLayoutDirectionService } from '../../services/direction/flex-direction.service';

@Component({
  template: `
    <app-flex-layout withScroll>
      <app-flex-layout-column>
        <div [style.height]="contentHeight" style="background: lightcoral;"></div>
      </app-flex-layout-column>
    </app-flex-layout>
  `,
})
export class LayoutWithScrollModeComponent {
  contentHeight = '200vh';
}

describe('FlexLayoutComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]), FlexThemeModule.forRoot(), FlexLayoutModule ],
      declarations: [ LayoutWithScrollModeComponent ],
    });
  });

  describe('withScroll mode - scroll block', () => {
    let fixture: ComponentFixture<LayoutWithScrollModeComponent>;
    let layoutComponent: FlexLayoutComponent;
    let scrollService: FlexLayoutScrollService;

    beforeEach(() => {
      fixture  = TestBed.createComponent(LayoutWithScrollModeComponent);
      fixture.detectChanges();

      layoutComponent = fixture.debugElement.query(By.directive(FlexLayoutComponent)).componentInstance;
      scrollService = TestBed.get(FlexLayoutScrollService);
    });

    it('should hide overflow when scroll blocked', fakeAsync(() => {
      scrollService.scrollable(false);
      flush();
      fixture.detectChanges();

      expect(layoutComponent.scrollableContainerRef.nativeElement.style.overflow).toEqual('hidden');
    }));

    it('should restore previous overflow value when enabling scroll', fakeAsync(() => {
      layoutComponent.scrollableContainerRef.nativeElement.style.overflow = 'auto';

      scrollService.scrollable(false);
      flush();
      fixture.detectChanges();
      scrollService.scrollable(true);
      flush();
      fixture.detectChanges();

      expect(layoutComponent.scrollableContainerRef.nativeElement.style.overflow).toEqual('auto');
    }));

    it('should restore previous padding left value when enabling scroll in LTR mode', fakeAsync(() => {
      layoutComponent.layoutContainerRef.nativeElement.style.paddingLeft = '1px';

      scrollService.scrollable(false);
      flush();
      fixture.detectChanges();
      scrollService.scrollable(true);
      flush();
      fixture.detectChanges();

      expect(layoutComponent.layoutContainerRef.nativeElement.style.paddingLeft).toEqual('1px');
    }));

    it('should restore previous padding right value when enabling scroll in RTL mode', fakeAsync(() => {
      const layoutDirectionService: FlexLayoutDirectionService = TestBed.get(FlexLayoutDirectionService);
      layoutDirectionService.setDirection(FlexLayoutDirection.RTL);
      flush();
      fixture.detectChanges();
      layoutComponent.layoutContainerRef.nativeElement.style.paddingRight = '1px';

      scrollService.scrollable(false);
      flush();
      fixture.detectChanges();
      scrollService.scrollable(true);
      flush();
      fixture.detectChanges();

      expect(layoutComponent.layoutContainerRef.nativeElement.style.paddingRight).toEqual('1px');
    }));
  });
});
