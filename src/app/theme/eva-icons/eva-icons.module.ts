import { NgModule } from '@angular/core';
import { icons } from 'eva-icons';
import { FlexSvgIcon } from '../component/icon/icon';
import { FlexIconLibraries } from '../component/icon/icon-libraries';
import { FlexIcons } from '../component/icon/icon-pack';

interface NebularOriginalEvaIcon {
  toSvg(options: NebularEvaIconOptions);
}

export interface NebularEvaIconOptions {
  width: string;
  height: string;
  fill: string;
  animation: {
    type: string,
    hover: boolean,
    infinite: boolean,
  };
}

export class NebularEvaSvgIcon extends FlexSvgIcon {

  constructor(protected name, protected content: NebularOriginalEvaIcon) {
    super(name, '');
  }

  getContent(options): string {
    return this.content.toSvg({
      width: '100%',
      height: '100%',
      fill: 'currentColor',
      ...options,
    });
  }
}

@NgModule({})
export class EvaIconsModule {

  private NAME = 'eva';

  constructor(iconLibrary: FlexIconLibraries) {
    iconLibrary.registerSvgPack(this.NAME, this.createIcons());
    iconLibrary.setDefaultPack(this.NAME);
  }

  private createIcons(): FlexIcons {
    return Object
      .entries<NebularOriginalEvaIcon>(icons)
      .map(([name, icon]) => {
        return [name, new NebularEvaSvgIcon(name, icon)] as [string, FlexSvgIcon];
      })
      .reduce((newIcons, [name, icon]: [string, FlexSvgIcon]) => {
        newIcons[name] = icon;
        return newIcons;
      }, {});
  }
}
