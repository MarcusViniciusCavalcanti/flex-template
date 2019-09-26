import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlexMenuItem } from '../menu/menu.service';
import { FlexThemeModule } from '../../flex-theme.module';
import { FlexSidebarModule } from './sidebar.module';
import { FlexMenuModule } from '../menu/menu.module';
import { FlexSidebarComponent } from './sidebar.component';
import { FlexMenuComponent, FlexMenuItemComponent } from '../menu/menu.component';
import { FlexIconComponent } from '../icon/icon.component';


@Component({
  template: `
    <app-flex-sidebar>
      <button id="button-outside-menu"></button>
      <app-flex-menu [items]="menuItems"></app-flex-menu>
    </app-flex-sidebar>
  `,
})
export class SidebarExpandTestComponent {
  menuItems: FlexMenuItem[] = [
    {
      title: 'no children',
    },
    {
      title: 'parent',
      children: [ { title: 'child' } ],
    },
    {
      title: 'group',
      group: true,
    },
  ];
}

describe('FlexSidebarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        FlexThemeModule.forRoot(),
        FlexSidebarModule.forRoot(),
        FlexMenuModule.forRoot(),
      ],
      declarations: [ SidebarExpandTestComponent ],
    });
  });

  describe('States (expanded, collapsed, compacted)', () => {
    let fixture: ComponentFixture<SidebarExpandTestComponent>;
    let sidebarComponent: FlexSidebarComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SidebarExpandTestComponent);
      fixture.detectChanges();

      sidebarComponent = fixture.debugElement.query(By.directive(FlexSidebarComponent)).componentInstance;
    });

    it(`should collapse when collapse method called`, () => {
      sidebarComponent.collapse();
      fixture.detectChanges();

      expect(sidebarComponent.expanded).toEqual(false);
    });

    it('should become compacted when compact method called', () => {
      sidebarComponent.compact();
      fixture.detectChanges();

      expect(sidebarComponent.compacted).toEqual(true);
    });

    it('should not expand when clicked outside menu', () => {
      const buttonOutsideMenu: DebugElement = fixture.debugElement.query(By.css('#button-outside-menu'));
      sidebarComponent.compact();
      fixture.detectChanges();

      buttonOutsideMenu.nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.compacted).toEqual(true);
    });

    it('should not expand when clicked on menu item without children', () => {
      sidebarComponent.compact();
      fixture.detectChanges();

      const menuItemWithNoChildren: DebugElement = fixture.debugElement.query(By.directive(FlexMenuComponent));
      menuItemWithNoChildren.nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.compacted).toEqual(true);
    });

    it('should not expand when clicked on menu group', () => {
      sidebarComponent.compact();
      fixture.detectChanges();

      const menuGroup: DebugElement = fixture.debugElement.queryAll(By.directive(FlexMenuItemComponent))[3];
      menuGroup.query(By.css('span')).nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.compacted).toEqual(true);
    });

    it('should expand when icon of menu item with child items clicked', () => {
      sidebarComponent.compact();
      fixture.detectChanges();

      const menuItemWithChildren: DebugElement = fixture.debugElement.queryAll(By.directive(FlexMenuItemComponent))[1];
      menuItemWithChildren.query(By.directive(FlexIconComponent)).nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.expanded).toEqual(true);
    });

    it('should expand when link of menu item with child items clicked', () => {
      sidebarComponent.compact();
      fixture.detectChanges();

      const menuItemWithChildren: DebugElement = fixture.debugElement.queryAll(By.directive(FlexMenuItemComponent))[1];
      menuItemWithChildren.query(By.css('a')).nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.expanded).toEqual(true);
    });
  });
});
