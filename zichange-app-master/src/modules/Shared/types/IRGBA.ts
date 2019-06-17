import { trim } from 'lodash';
import { observable } from 'mobx';

export interface IRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class RGBA {

  @observable r: number;
  @observable g: number;
  @observable b: number;
  @observable a: number;

  constructor(data: RGBA) {
    Object.assign(this, data);
  }

  static get defaultColor(): RGBA {
    return new RGBA({r: 0, g: 0, b: 0, a: 1});
  }

  static toRGBAString(rgba: RGBA) {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }

  static toRGBString(rgba: RGBA) {
    return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
  }

  static toHEX(rgba: RGBA) {
    const r: number = parseInt(trim(rgba.r.toString()), 10);
    const g: number = parseInt(trim(rgba.g.toString()), 10);
    const b: number = parseInt(trim(rgba.b.toString()), 10);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16));
  }
}