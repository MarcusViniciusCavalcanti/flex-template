import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexAlertComponent } from './alert.component';

describe('Component: FlexAlert', () => {

  let alert: FlexAlertComponent;
  let fixture: ComponentFixture<FlexAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlexAlertComponent],
    });

    fixture = TestBed.createComponent(FlexAlertComponent);
    alert = fixture.componentInstance;
  });

  it('should set class danger', () => {
    alert.status = 'danger';
    fixture.detectChanges();
    expect(
      fixture
        .debugElement.nativeElement.classList.contains('status-danger'))
      .toBeTruthy();
  });

  it('should set outline class', () => {
    alert.outline = 'success';
    fixture.detectChanges();
    expect(
      fixture
        .debugElement.nativeElement.classList.contains('outline-success'))
      .toBeTruthy();
  });

  it('should set shape class', () => {
    alert.accent = 'warning';
    fixture.detectChanges();
    expect(
      fixture
        .debugElement.nativeElement.classList.contains('accent-warning'))
      .toBeTruthy();
  });

  it('should set size class', () => {
    alert.size = 'small';
    fixture.detectChanges();
    expect(
      fixture
        .debugElement.nativeElement.classList.contains('size-small'))
      .toBeTruthy();
  });
});
