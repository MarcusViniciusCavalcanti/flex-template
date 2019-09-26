import { Injectable } from '@angular/core';
import { FlexFontIconPackParams, FlexIconPack, FlexIconPackParams, FlexIconPackType, FlexIcons } from './icon-pack';
import { FlexFontIcon, FlexIcon, FlexSvgIcon } from './icon';

export class FlexIconDefinition {
  name: string;
  type: string;
  pack: string;
  icon: FlexIcon;
}

function throwPackNotFoundError(name: string) {
  throw Error(`Icon Pack '${name}' is not registered`);
}

function throwNoDefaultPackError() {
  throw Error('Default pack is not registered.');
}

function throwIconNotFoundError(name: string, pack: string) {
  throw Error(`Icon '${name}' is not registered in pack '${pack}'. Check icon name or consider switching icon pack.`);
}

function throwWrongPackTypeError(name: string, type: string, desiredType: string) {
  throw Error(`Pack '${name}' is not an '${desiredType}' Pack and its type is '${type}'`);
}

@Injectable({providedIn: 'root'})
export class FlexIconLibraries {

  protected packs: Map<string, FlexIconPack> = new Map();
  protected defaultPack: FlexIconPack;

  registerSvgPack(name: string, icons: FlexIcons, params: FlexIconPackParams= {}) {
    this.packs.set(name, {
      name,
      icons: new Map(Object.entries(icons)),
      params,
      type: FlexIconPackType.SVG,
    });
  }

  registerFontPack(name: string, params: FlexFontIconPackParams = {}) {
    this.packs.set(name, {
      name,
      params,
      icons: new Map(),
      type: FlexIconPackType.FONT,
    });
  }

  getPack(name: string): FlexIconPack {
    return this.packs.get(name);
  }

  setDefaultPack(name: string) {
    if (!this.packs.has(name)) {
      throwPackNotFoundError(name);
    }

    this.defaultPack = this.packs.get(name);
  }

  getSvgIcon(name: string, pack?: string): FlexIconDefinition {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== FlexIconPackType.SVG) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'SVG');
    }

    const icon = this.getIconFromPack(name, iconsPack);

    return {
      name,
      pack: iconsPack.name,
      type: FlexIconPackType.SVG,
      icon: this.createSvgIcon(name, icon, iconsPack.params),
    };
  }

  getFontIcon(name: string, pack?: string): FlexIconDefinition {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== FlexIconPackType.FONT) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'Font');
    }

    const icon = this.getIconFromPack(name, iconsPack, false);

    return {
      name,
      pack: iconsPack.name,
      type: FlexIconPackType.FONT,
      icon: this.createFontIcon(name, icon ? icon : '', iconsPack.params),
    };
  }

  getIcon(name: string, pack?: string): FlexIconDefinition {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type === FlexIconPackType.SVG) {
      return this.getSvgIcon(name, pack);
    }

    return this.getFontIcon(name, pack);
  }

  protected createSvgIcon(name: string, content: FlexIcon | string, params: FlexIconPackParams): FlexSvgIcon {
    return content instanceof FlexSvgIcon ? content : new FlexSvgIcon(name, content, params);
  }

  protected createFontIcon(name: string, content: FlexIcon | string, params: FlexFontIconPackParams): FlexFontIcon {
    return content instanceof FlexFontIcon ? content : new FlexFontIcon(name, content, params);
  }

  protected getPackOrThrow(name: string): FlexIconPack {

    const pack: FlexIconPack = this.packs.get(name);
    if (!pack) {
      throwPackNotFoundError(name);
    }
    return pack;
  }

  protected getDefaultPackOrThrow(): FlexIconPack {

    if (!this.defaultPack) {
      throwNoDefaultPackError();
    }
    return this.defaultPack;
  }

  protected getIconFromPack(name: string, pack: FlexIconPack, shouldThrow = true): FlexIcon | string {
    if (shouldThrow && !pack.icons.has(name)) {
      throwIconNotFoundError(name, pack.name);
    }

    return pack.icons.get(name);
  }
}
