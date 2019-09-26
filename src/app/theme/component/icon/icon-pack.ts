import { FlexIcon } from './icon';

export interface FlexIcons {
  [key: string]: FlexIcon | string;
}

export enum FlexIconPackType  {
  SVG = 'svg',
  FONT = 'font',
}

export interface FlexIconPackParams {
  packClass?: string,
  [name: string]: any,
}

export interface FlexFontIconPackParams extends FlexIconPackParams {
  iconClassPrefix?: string,
}

export interface FlexIconPack {
  name: string;
  type: FlexIconPackType;
  icons: Map<string, FlexIcon | string>;
  params: FlexIconPackParams,
}
