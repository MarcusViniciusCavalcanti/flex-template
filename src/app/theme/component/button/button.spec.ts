import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexButtonComponent } from './button.component';

describe('Component: FlexButton', () => {

  let button: FlexButtonComponent;
  let fixture: ComponentFixture<FlexButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlexButtonComponent],
    });

    fixture = TestBed.createComponent(FlexButtonComponent);
    button = fixture.componentInstance;
  });

  it('should set class danger', () => {
    button.status = 'danger';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('status-danger');
  });

  it('should set size small', () => {
    button.size = 'small';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('size-small');
  });

  it('should set outline class', () => {
    button.outline = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('appearance-outline');
  });

  it('should set hero class', () => {
    button.hero = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('appearance-hero');
  });

  it('should set shape class', () => {
    button.shape = 'semi-round';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('shape-semi-round');
  });

  it('should set full-width class', () => {
    button.fullWidth = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('full-width');
  });
});
