import { FlexFontIcon, FlexSvgIcon } from './icon';
import { TestBed } from '@angular/core/testing';
import { FlexIconModule } from './icon.module';
import { FlexIconComponent, FlexIconConfig } from './icon.component';

describe('icon', () => {
  let fontIcon: FlexFontIcon;
  let svgIcon: FlexSvgIcon;


  it(`font icon renders`, () => {

    fontIcon = new FlexFontIcon('home', 'custom', {
      packClass: 'custom-pack',
      iconClassPrefix: 'cp',
    });

    expect(fontIcon.getContent()).toEqual('custom');
  });

  it(`font icon getClasses return classes`, () => {

    fontIcon = new FlexFontIcon('home', '', {
      packClass: 'custom-pack',
    });

    expect(fontIcon.getClasses()).toEqual(['custom-pack', 'home']);
  });

  it(`font icon getClasses return class with prefix`, () => {

    fontIcon = new FlexFontIcon('home', '', {
      packClass: 'custom-pack',
      iconClassPrefix: 'cp',
    });

    expect(fontIcon.getClasses()).toEqual(['custom-pack', 'cp-home']);
  });

  it(`font icon getClasses return class with name only`, () => {

    fontIcon = new FlexFontIcon('home', '');

    expect(fontIcon.getClasses()).toEqual(['home']);
  });

  it(`svg icon renders`, () => {

    svgIcon = new FlexSvgIcon('home', 'content', {
      packClass: 'custom-pack',
    });

    expect(svgIcon.getContent()).toEqual('content');
  });

  it(`svg icon getClasses return class`, () => {

    svgIcon = new FlexSvgIcon('home', '', {
      packClass: 'custom-pack',
    });

    expect(svgIcon.getClasses()).toEqual(['custom-pack']);
  });

  it(`svg icon getClasses return class without name`, () => {

    svgIcon = new FlexSvgIcon('home', '');

    expect(svgIcon.getClasses()).toEqual([]);
  });
});

describe('FlexIconComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FlexIconModule ],
    });
  });

  it('should set icon name when string passed as a config', () => {
    const iconComponent: FlexIconComponent = TestBed.createComponent(FlexIconComponent).componentInstance;
    const iconName = 'some-icon';

    iconComponent.config = iconName;

    expect(iconComponent.icon).toEqual(iconName);
  });

  it('should set icon when object with icon passed as a config', () => {
    const iconComponent: FlexIconComponent = TestBed.createComponent(FlexIconComponent).componentInstance;
    const iconConfig: FlexIconConfig = { icon: 'some-icon' };

    iconComponent.config = iconConfig;

    expect(iconComponent.icon).toEqual(iconConfig.icon);
  });

  it('should set pack when object with pack passed as a config', () => {
    const iconComponent: FlexIconComponent = TestBed.createComponent(FlexIconComponent).componentInstance;
    const iconConfig: FlexIconConfig = { icon: 'some-icon', pack: 'some-pack' };

    iconComponent.config = iconConfig;

    expect(iconComponent.pack).toEqual(iconConfig.pack);
  });

  it('should set status when object with status passed as a config', () => {
    const iconComponent: FlexIconComponent = TestBed.createComponent(FlexIconComponent).componentInstance;
    const iconConfig: FlexIconConfig = { icon: 'some-icon', status: 'danger' };

    iconComponent.config = iconConfig;

    expect(iconComponent.status).toEqual(iconConfig.status);
  });

  it('should set options when object with options passed as a config', () => {
    const iconComponent: FlexIconComponent = TestBed.createComponent(FlexIconComponent).componentInstance;
    const options = { someProp: 'someVal' };
    const iconConfig: FlexIconConfig = { icon: 'some-icon', options };

    iconComponent.config = iconConfig;

    expect(iconComponent.options).toEqual(iconConfig.options);
  });

  it('should do nothing when falsy value passed as a config', () => {
    const iconComponent: FlexIconComponent = TestBed.createComponent(FlexIconComponent).componentInstance;
    const config: FlexIconConfig = { icon: 'icon', pack: 'pack', status: 'danger', options: { opt: 'opt' } };
    iconComponent.config = config;

    iconComponent.config = null;
    expect(iconComponent.config).toEqual(config);
  });
});
