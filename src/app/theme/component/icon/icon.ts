import { FlexFontIconPackParams, FlexIconPackParams } from './icon-pack';

export interface FlexIconOptions {
  [name: string]: any;
}

export interface FlexIcon {
  getClasses(options?: FlexIconOptions): string[];
  getContent(options?: FlexIconOptions): string;
}

export class FlexFontIcon implements FlexIcon {

  constructor(protected name, protected content: any, protected params: FlexFontIconPackParams = {}) {}

  getClasses(options?: FlexIconOptions): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }

    const name = this.params.iconClassPrefix ? `${this.params.iconClassPrefix}-${this.name}` : this.name;
    classes.push(name);
    return classes;
  }

  getContent(options?: FlexIconOptions): string {
    return this.content;
  }
}

export class FlexSvgIcon implements FlexIcon {

  constructor(protected name, protected content: any, protected params: FlexIconPackParams = {}) {}

  getClasses(options?: FlexIconOptions): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }
    return classes;
  }

  getContent(options?: FlexIconOptions): string {
    return this.content;
  }
}
