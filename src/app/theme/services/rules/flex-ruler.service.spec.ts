import { Component, ElementRef, ViewChild } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick, async, inject } from '@angular/core/testing';
import { FlexLayoutRulerService, FlexLayoutDimensions } from './flex-ruler.service';
import { FlexThemeService } from '../flex-theme.service';
import { FlexThemeModule } from '../../flex-theme.module';
import { FLEX_DOCUMENT } from '../../theme.options';
import { FlexLayoutModule } from '../../component/layout/layout.module';

let currentDocument;
let fixture: ComponentFixture<RulerTestComponent>;
let componentInstance: RulerTestComponent;
let rulerService: FlexLayoutRulerService;

@Component({
  template: `
    <app-flex-layout [withScroll]="localScroll" #layout>
      <app-flex-layout-column>
        <div #resize></div>
      </app-flex-layout-column>
    </app-flex-layout>
  `,
})
class RulerTestComponent {

  @ViewChild('resize', { read: ElementRef, static: false }) private resizeElement: ElementRef;
  @ViewChild('layout', { read: ElementRef, static: false }) private layout: ElementRef;
  localScroll = false;

  setSize(width: string, height: string) {
    this.resizeElement.nativeElement.style.width = width;
    this.resizeElement.nativeElement.style.height = height;
  }

  useLocalScroll() {
    this.localScroll = true;
  }

  getScrollableElement() {
    return this.layout.nativeElement.querySelector('.scrollable-container');
  }
}

// This is rather a smoke test
describe('FlexLayoutRulerService', () => {

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ RouterModule.forRoot([]), FlexThemeModule.forRoot(), FlexLayoutModule ],
      providers: [ FlexLayoutRulerService, FlexThemeService, { provide: APP_BASE_HREF, useValue: '/' } ],
      declarations: [ RulerTestComponent ],
    })
      .createComponent(RulerTestComponent);

    componentInstance = fixture.componentInstance;

    fixture.detectChanges();
  });

  beforeEach(async(inject(
    [FlexLayoutRulerService, FLEX_DOCUMENT],
    (service, document) => {
      rulerService = service;
      currentDocument = document;
    },
  )));

  afterEach(fakeAsync(() => {
    fixture.destroy();
    tick();
    fixture.nativeElement.remove();
  }));

  it('should get dimensions from document', (done) => {
    fixture.detectChanges();
    rulerService.getDimensions()
      .subscribe((size: FlexLayoutDimensions) => {
        expect(size.clientHeight).toEqual(currentDocument.documentElement.clientHeight);
        expect(size.clientWidth).toEqual(currentDocument.documentElement.clientWidth);
        expect(size.scrollHeight).toEqual(currentDocument.documentElement.scrollHeight);
        expect(size.scrollWidth).toEqual(currentDocument.documentElement.scrollWidth);
        done();
      });
  });

  it('should get dimensions from document when scrolls', (done) => {
    componentInstance.setSize('10000px', '10000px');
    fixture.detectChanges();
    rulerService.getDimensions()
      .subscribe((size: FlexLayoutDimensions) => {
        expect(size.clientHeight).toEqual(currentDocument.documentElement.clientHeight);
        expect(size.clientWidth).toEqual(currentDocument.documentElement.clientWidth);
        expect(size.scrollHeight).toEqual(currentDocument.documentElement.scrollHeight);
        expect(size.scrollWidth).toEqual(currentDocument.documentElement.scrollWidth);
        done();
      })
  });

  it('should get dimensions from scrollable', (done) => {
    componentInstance.useLocalScroll();
    fixture.detectChanges();
    const scrollable = componentInstance.getScrollableElement();
    rulerService.getDimensions()
      .subscribe((size: FlexLayoutDimensions) => {
        expect(size.clientHeight).toEqual(scrollable.clientHeight);
        expect(size.clientWidth).toEqual(scrollable.clientWidth);
        expect(size.scrollHeight).toEqual(scrollable.scrollHeight);
        expect(size.scrollWidth).toEqual(scrollable.scrollWidth);
        done();
      })
  });

  it('should get dimensions from scrollable when scrolls', (done) => {
    componentInstance.useLocalScroll();
    componentInstance.setSize('10000px', '10000px');
    fixture.detectChanges();
    const scrollable = componentInstance.getScrollableElement();
    rulerService.getDimensions()
      .subscribe((size: FlexLayoutDimensions) => {
        expect(size.clientHeight).toEqual(scrollable.clientHeight);
        expect(size.clientWidth).toEqual(scrollable.clientWidth);
        expect(size.scrollHeight).toEqual(scrollable.scrollHeight);
        expect(size.scrollWidth).toEqual(scrollable.scrollWidth);
        done();
      })
  });

});
