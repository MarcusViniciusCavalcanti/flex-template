import { Component, ElementRef, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FlexIconModule } from './icon.module';
import { FlexIconLibraries } from './icon-libraries';
import { FlexIconComponent } from './icon.component';


@Component({
  template: `
    <app-flex-icon #iconEl [icon]="icon"></app-flex-icon>
  `,
})
class IconTestComponent {
  @Input() icon;
}

describe('Component: FlexIcon', () => {

  let iconTestComponent: IconTestComponent;
  let fixture: ComponentFixture<IconTestComponent>;
  let iconElement: ElementRef;
  let iconsLibrary: FlexIconLibraries;

  beforeEach(() => {

    const bed = TestBed.configureTestingModule({
      imports: [ FlexIconModule ],
      providers: [ FlexIconLibraries ],
      declarations: [ IconTestComponent ],
    });

    fixture = bed.createComponent(IconTestComponent);
    iconsLibrary = bed.get(FlexIconLibraries);

    iconsLibrary
      .registerSvgPack('svg-pack', { home: '<svg><rect></rect></svg>' }, { packClass: 'custom-pack' });
    iconsLibrary.setDefaultPack('svg-pack');

    iconTestComponent = fixture.componentInstance;
    iconElement = fixture.debugElement.query(By.directive(FlexIconComponent));
  });

  it('should render icon', () => {
    iconTestComponent.icon = 'home';
    fixture.detectChanges();

    const svg = iconElement.nativeElement.querySelector('svg');

    expect(iconElement.nativeElement.classList.contains('custom-pack')).toBeTruthy();
    expect(svg.innerHTML).toContain('<rect></rect>');
  });
});
