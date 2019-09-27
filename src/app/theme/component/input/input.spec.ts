import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FlexComponentStatus } from '../component-status';
import { FlexComponentSize } from '../component-size';
import { FlexComponentShape } from '../component-shape';
import { FlexInputModule } from './input.module';
import { FlexInputDirective } from './input.directive';

@Component({
  template: `
    <input #inputEl appInput [fieldSize]="size" [status]="status" [shape]="shape" [fullWidth]="fullWidth">
    <textarea #textareaEl appInput [fieldSize]="size" [status]="status" [shape]="shape" [fullWidth]="fullWidth">
    </textarea>
  `,
})
class InputTestComponent {
  @Input() size: FlexComponentSize;
  @Input() status: FlexComponentStatus;
  @Input() shape: FlexComponentShape;
  @Input() fullWidth = false;
}

describe('Directive: FlexInput', () => {

  let inputTestComponent: InputTestComponent;
  let fixture: ComponentFixture<InputTestComponent>;
  let inputElement: Element;
  let textareaElement: Element;
  let inputDirective: FlexInputDirective;

  beforeEach(() => {

    fixture = TestBed.configureTestingModule({
        imports: [ FlexInputModule ],
        declarations: [ InputTestComponent ],
      })
      .createComponent(InputTestComponent);

    inputTestComponent = fixture.componentInstance;

    inputDirective = fixture.debugElement.query(By.directive(FlexInputDirective)).componentInstance;
    inputElement = fixture.debugElement.query(By.css('textarea')).nativeElement;
    textareaElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should set status', () => {
    inputTestComponent.status = 'danger';
    fixture.detectChanges();

    expect(inputElement.classList).toContain('status-danger');
    expect(textareaElement.classList).toContain('status-danger');
  });

  it('should set size', () => {
    inputTestComponent.size = 'large';
    fixture.detectChanges();

    expect(inputElement.classList).toContain('size-large');
    expect(textareaElement.classList).toContain('size-large');
  });

  it('should set shape class', () => {
    inputTestComponent.shape = 'semi-round';
    fixture.detectChanges();

    expect(inputElement.classList).toContain('shape-semi-round');
    expect(textareaElement.classList).toContain('shape-semi-round');
  });

  it('should set full width', () => {
    inputTestComponent.fullWidth = true;
    fixture.detectChanges();

    expect(inputElement.classList).toContain('input-full-width');
    expect(textareaElement.classList).toContain('input-full-width');
  });
});
