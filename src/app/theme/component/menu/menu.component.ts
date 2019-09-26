import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  DoCheck,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { takeWhile, filter, map } from 'rxjs/operators';
import { FlexMenuInternalService, FlexMenuItem, FlexMenuBag, FlexMenuService } from './menu.service';
import { convertToBoolProperty } from '../helpers';
import { FLEX_WINDOW } from '../../theme.options';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FlexLayoutDirectionService } from '../../services/direction/flex-direction.service';

export enum FlexToggleStates {
  Expanded = 'expanded',
  Collapsed = 'collapsed',
}

@Component({
  selector: '[flexMenuItem]', // TODO: mudar nome => selector
  templateUrl: './menu-item.component.html',
  animations: [
    trigger('toggle', [
      state(FlexToggleStates.Collapsed, style({ height: '0', margin: '0' })),
      state(FlexToggleStates.Expanded, style({ height: '*' })),
      transition(`${FlexToggleStates.Collapsed} <=> ${FlexToggleStates.Expanded}`, animate(300)),
    ]),
  ],
})
export class FlexMenuItemComponent implements DoCheck, AfterViewInit, OnDestroy {
  @Input() menuItem = null as FlexMenuItem;

  @Output() hoverItem = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();
  @Output() selectItem = new EventEmitter<any>();
  @Output() itemClick = new EventEmitter<any>();

  protected alive = true;
  toggleState: FlexToggleStates;

  constructor(protected menuService: FlexMenuService,
              protected directionService: FlexLayoutDirectionService) {}

  ngDoCheck() {
    this.toggleState = this.menuItem.expanded ? FlexToggleStates.Expanded : FlexToggleStates.Collapsed;
  }

  ngAfterViewInit() {
    this.menuService.onSubmenuToggle()
      .pipe(
        takeWhile(() => this.alive),
        filter(({ item }) => item === this.menuItem),
        map(({ item }: FlexMenuBag) => item.expanded),
      )
      .subscribe(isExpanded => this.toggleState = isExpanded ? FlexToggleStates.Expanded : FlexToggleStates.Collapsed);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onToggleSubMenu(item: FlexMenuItem) {
    this.toggleSubMenu.emit(item);
  }

  onHoverItem(item: FlexMenuItem) {
    this.hoverItem.emit(item);
  }

  onSelectItem(item: FlexMenuItem) {
    this.selectItem.emit(item);
  }

  onItemClick(item: FlexMenuItem) {
    this.itemClick.emit(item);
  }

  getExpandStateIcon(): string {
    if (this.menuItem.expanded) {
      return 'chevron-down-outline';
    }

    return this.directionService.isLtr()
      ? 'chevron-left-outline'
      : 'chevron-right-outline';
  }
}

@Component({
  selector: 'app-flex-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <ul class="menu-items">
      <ng-container *ngFor="let item of items">
        <li flexMenuItem *ngIf="!item.hidden"
            [menuItem]="item"
            [class.menu-group]="item.group"
            (hoverItem)="onHoverItem($event)"
            (toggleSubMenu)="onToggleSubMenu($event)"
            (selectItem)="onSelectItem($event)"
            (itemClick)="onItemClick($event)"
            class="menu-item">
        </li>
      </ng-container>
    </ul>
  `,
})
export class FlexMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() tag: string;
  @Input() items: FlexMenuItem[];

  @Input()
  get autoCollapse(): boolean {
    return this._autoCollapse;
  }

  set autoCollapse(value: boolean) {
    this._autoCollapse = convertToBoolProperty(value);
  }

  // tslint:disable-next-line:variable-name
  protected _autoCollapse = false;

  protected alive = true;

  constructor(@Inject(FLEX_WINDOW) protected window,
              protected menuInternalService: FlexMenuInternalService,
              protected router: Router) {
  }

  ngOnInit() {
    this.menuInternalService.prepareItems(this.items);

    this.menuInternalService
      .onAddItem()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string; items: FlexMenuItem[] }) => this.compareTag(data.tag)),
      )
      .subscribe(data => this.onAddItem(data));

    this.menuInternalService
      .onNavigateHome()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string; items: FlexMenuItem[] }) => this.compareTag(data.tag)),
      )
      .subscribe(() => this.navigateHome());

    this.menuInternalService
      .onGetSelectedItem()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string; listener: BehaviorSubject<FlexMenuBag> }) => this.compareTag(data.tag)),
      )
      .subscribe((data: { tag: string; listener: BehaviorSubject<FlexMenuBag> }) => {
        data.listener.next({ tag: this.tag, item: this.getSelectedItem(this.items) });
      });

    this.menuInternalService
      .onCollapseAll()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string }) => this.compareTag(data.tag)),
      )
      .subscribe(() => this.collapseAll());

    this.router.events
      .pipe(
        takeWhile(() => this.alive),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.menuInternalService.selectFromUrl(this.items, this.tag, this.autoCollapse);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.menuInternalService.selectFromUrl(this.items, this.tag, this.autoCollapse));
  }

  onAddItem(data: { tag: string; items: FlexMenuItem[] }) {
    this.items.push(...data.items);

    this.menuInternalService.prepareItems(this.items);
    this.menuInternalService.selectFromUrl(this.items, this.tag, this.autoCollapse);
  }

  onHoverItem(item: FlexMenuItem) {
    this.menuInternalService.itemHover(item, this.tag);
  }

  onToggleSubMenu(item: FlexMenuItem) {
    if (this.autoCollapse) {
      this.menuInternalService.collapseAll(this.items, this.tag, item);
    }
    item.expanded = !item.expanded;
    this.menuInternalService.submenuToggle(item, this.tag);
  }

  onSelectItem(item: FlexMenuItem) {
    this.menuInternalService.selectItem(item, this.items, this.autoCollapse, this.tag);
  }

  onItemClick(item: FlexMenuItem) {
    this.menuInternalService.itemClick(item, this.tag);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  protected navigateHome() {
    const homeItem = this.getHomeItem(this.items);

    if (homeItem) {
      if (homeItem.link) {
        // TODO: then
        this.router.navigate([homeItem.link], { queryParams: homeItem.queryParams, fragment: homeItem.fragment });
      }

      if (homeItem.url) {
        this.window.location.href = homeItem.url;
      }
    }
  }

  protected collapseAll() {
    this.menuInternalService.collapseAll(this.items, this.tag);
  }

  protected getHomeItem(items: FlexMenuItem[]): FlexMenuItem {
    for (const item of items) {
      if (item.home) {
        return item;
      }

      const homeItem = item.children && this.getHomeItem(item.children);
      if (homeItem) {
        return homeItem;
      }
    }
  }

  protected compareTag(tag: string) {
    return !tag || tag === this.tag;
  }

  protected getSelectedItem(items: FlexMenuItem[]): FlexMenuItem {
    let selected = null;
    items.forEach((item: FlexMenuItem) => {
      if (item.selected) {
        selected = item;
      }
      if (item.selected && item.children && item.children.length > 0) {
        selected = this.getSelectedItem(item.children);
      }
    });
    return selected;
  }
}
