import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Params } from '@angular/router';
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { isFragmentContain, isFragmentEqual, isUrlPathContain, isUrlPathEqual } from './url-matching-helpers';
import { FlexIconConfig } from '../icon/icon.component';

export interface FlexMenuBag { tag: string; item: FlexMenuItem; }

const itemClick$ = new Subject<FlexMenuBag>();
const addItems$ = new ReplaySubject<{ tag: string; items: FlexMenuItem[] }>(1);
const navigateHome$ = new ReplaySubject<{ tag: string }>(1);
const getSelectedItem$
  = new ReplaySubject<{ tag: string; listener: BehaviorSubject<FlexMenuBag> }>(1);
const itemSelect$ = new ReplaySubject<FlexMenuBag>(1);
const itemHover$ = new ReplaySubject<FlexMenuBag>(1);
const submenuToggle$ = new ReplaySubject<FlexMenuBag>(1);
const collapseAll$ = new ReplaySubject<{ tag: string }>(1);

export class FlexMenuItem {

  title: string;

  link?: string;

  url?: string;

  icon?: string | FlexIconConfig;

  expanded?: boolean;

  children?: FlexMenuItem[];

  target?: string;

  hidden?: boolean;

  pathMatch?: 'full' | 'prefix' = 'full';

  home?: boolean;

  group?: boolean;

  skipLocationChange?: boolean;

  queryParams?: Params;

  parent?: FlexMenuItem;

  selected?: boolean;

  data?: any;

  fragment?: string;

  static getParents(item: FlexMenuItem): FlexMenuItem[] {
    const parents = [];

    let parent = item.parent;
    while (parent) {
      parents.unshift(parent);
      parent = parent.parent;
    }

    return parents;
  }

  static isParent(item: FlexMenuItem, possibleChild: FlexMenuItem): boolean {
    return possibleChild.parent
      ? possibleChild.parent === item || this.isParent(item, possibleChild.parent)
      : false;
  }
}

@Injectable()
export class FlexMenuService {

  addItems(items: FlexMenuItem[], tag?: string) {
    addItems$.next({ tag, items });
  }

  collapseAll(tag?: string) {
    collapseAll$.next({ tag });
  }

  navigateHome(tag?: string) {
    navigateHome$.next({ tag });
  }

  getSelectedItem(tag?: string): Observable<FlexMenuBag> {
    const listener = new BehaviorSubject<FlexMenuBag>(null);

    getSelectedItem$.next({ tag, listener });

    return listener.asObservable();
  }

  onItemClick(): Observable<FlexMenuBag> {
    return itemClick$.pipe(share());
  }

  onItemSelect(): Observable<FlexMenuBag> {
    return itemSelect$.pipe(share());
  }

  onItemHover(): Observable<FlexMenuBag> {
    return itemHover$.pipe(share());
  }

  onSubmenuToggle(): Observable<FlexMenuBag> {
    return submenuToggle$.pipe(share());
  }
}

@Injectable()
export class FlexMenuInternalService {

  constructor(private location: Location) {}

  prepareItems(items: FlexMenuItem[]) {
    const defaultItem = new FlexMenuItem();
    items.forEach(i => {
      this.applyDefaults(i, defaultItem);
      this.setParent(i);
    });
  }

  selectFromUrl(items: FlexMenuItem[], tag: string, collapseOther: boolean = false) {
    const selectedItem = this.findItemByUrl(items);
    if (selectedItem) {
      this.selectItem(selectedItem, items, collapseOther, tag);
    }
  }

  selectItem(item: FlexMenuItem, items: FlexMenuItem[], collapseOther: boolean = false, tag: string) {
    const unselectedItems = this.resetSelection(items);
    const collapsedItems = collapseOther ? this.collapseItems(items) : [];

    for (const parent of FlexMenuItem.getParents(item)) {
      parent.selected = true;

      if (!unselectedItems.includes(parent)) {
        this.itemSelect(parent, tag);
      }

      const wasNotExpanded = !parent.expanded;
      parent.expanded = true;
      const i = collapsedItems.indexOf(parent);

      if (i === -1 && wasNotExpanded) {
        this.submenuToggle(parent, tag);
      } else {
        collapsedItems.splice(i, 1);
      }
    }

    item.selected = true;

    if (!unselectedItems.includes(item)) {
      this.itemSelect(item, tag);
    }

    for (const collapsedItem of collapsedItems) {
      this.submenuToggle(collapsedItem, tag);
    }
  }

  collapseAll(items: FlexMenuItem[], tag: string, except?: FlexMenuItem) {
    const collapsedItems = this.collapseItems(items, except);

    for (const item of collapsedItems) {
      this.submenuToggle(item, tag);
    }
  }

  onAddItem(): Observable<{ tag: string; items: FlexMenuItem[] }> {
    return addItems$.pipe(share());
  }

  onNavigateHome(): Observable<{ tag: string }> {
    return navigateHome$.pipe(share());
  }

  onCollapseAll(): Observable<{ tag: string }> {
    return collapseAll$.pipe(share());
  }

  onGetSelectedItem(): Observable<{ tag: string; listener: BehaviorSubject<FlexMenuBag> }> {
    return getSelectedItem$.pipe(share());
  }

  itemHover(item: FlexMenuItem, tag?: string) {
    itemHover$.next({tag, item});
  }

  submenuToggle(item: FlexMenuItem, tag?: string) {
    submenuToggle$.next({tag, item});
  }

  itemSelect(item: FlexMenuItem, tag?: string) {
    itemSelect$.next({tag, item});
  }

  itemClick(item: FlexMenuItem, tag?: string) {
    itemClick$.next({tag, item});
  }

  private resetSelection(items: FlexMenuItem[]): FlexMenuItem[] {
    const unselectedItems = [];

    for (const item of items) {
      if (item.selected) {
        unselectedItems.push(item);
      }
      item.selected = false;

      if (item.children) {
        unselectedItems.push(...this.resetSelection(item.children));
      }
    }

    return unselectedItems;
  }

  private collapseItems(items: FlexMenuItem[], except?: FlexMenuItem): FlexMenuItem[] {
    const collapsedItems = [];

    for (const item of items) {
      if (except && (item === except || FlexMenuItem.isParent(item, except))) {
        continue;
      }

      if (item.expanded) {
        collapsedItems.push(item);
      }
      item.expanded = false;

      if (item.children) {
        collapsedItems.push(...this.collapseItems(item.children));
      }
    }

    return collapsedItems;
  }

  private applyDefaults(item, defaultItem) {
    const menuItem = {...item};
    Object.assign(item, defaultItem, menuItem);
    if (item.children) {
      item.children.forEach(child => this.applyDefaults(child, defaultItem));
    }
  }

  private setParent(item: FlexMenuItem) {
    if (item.children) {
      item.children.forEach(child => {
        child.parent = item;
        this.setParent(child);
      });
    }
  }

  private findItemByUrl(items: FlexMenuItem[]): FlexMenuItem | undefined {
    let selectedItem;

    items.some(item => {
      if (item.children) {
        selectedItem = this.findItemByUrl(item.children);
      }
      if (!selectedItem && this.isSelectedInUrl(item)) {
        selectedItem = item;
      }

      return selectedItem;
    });

    return selectedItem;
  }

  private isSelectedInUrl(item: FlexMenuItem): boolean {
    const exact: boolean = item.pathMatch === 'full';
    const link: string = item.link;

    const isSelectedInPath = exact
      ? isUrlPathEqual(this.location.path(), link)
      : isUrlPathContain(this.location.path(), link);

    if (isSelectedInPath && item.fragment != null) {
      return exact
        ? isFragmentEqual(this.location.path(true), item.fragment)
        : isFragmentContain(this.location.path(true), item.fragment);
    }

    return isSelectedInPath;
  }
}
