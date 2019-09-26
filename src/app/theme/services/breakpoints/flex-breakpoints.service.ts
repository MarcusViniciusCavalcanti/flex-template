import { Inject, Injectable } from '@angular/core';
import { FLEX_MEDIA_BREAKPOINTS } from '../../theme.options';

export interface FlexMediaBreakpoint {
  name: string;
  width: number;
}

export const DEFAULT_MEDIA_BREAKPOINTS = [
  {
    name: 'xs',
    width: 0,
  },
  {
    name: 'is',
    width: 400,
  },
  {
    name: 'sm',
    width: 576,
  },
  {
    name: 'md',
    width: 768,
  },
  {
    name: 'lg',
    width: 992,
  },
  {
    name: 'xl',
    width: 1200,
  },
  {
    name: 'xxl',
    width: 1400,
  },
  {
    name: 'xxxl',
    width: 1600,
  },
];

@Injectable()
export class FlexMediaBreakpointsService {

  private breakpointsMap: { [ breakpoint: string ]: number };

  constructor(@Inject(FLEX_MEDIA_BREAKPOINTS) private breakpoints) {
    this.breakpointsMap = this.breakpoints.reduce((res, b: FlexMediaBreakpoint) => {
      res[b.name] = b.width;
      return res;
    }, {});
  }

  getByWidth(width: number): FlexMediaBreakpoint {
    const unknown = { name: 'unknown', width };
    const breakpoints = this.getBreakpoints();

    return breakpoints
      .find((point: FlexMediaBreakpoint, index: number) => {
        const next = breakpoints[index + 1];
        return width >= point.width && (!next || width < next.width);
      }) || unknown;
  }

  getByName(name: string): FlexMediaBreakpoint {
    const unknown = { name: 'unknown', width: NaN };
    const breakpoints = this.getBreakpoints();

    return breakpoints.find((point: FlexMediaBreakpoint) => name === point.name) || unknown;
  }

  getBreakpoints(): FlexMediaBreakpoint[] {
    return this.breakpoints;
  }

  getBreakpointsMap(): { [breakpoint: string]: number } {
    return this.breakpointsMap;
  }
}
