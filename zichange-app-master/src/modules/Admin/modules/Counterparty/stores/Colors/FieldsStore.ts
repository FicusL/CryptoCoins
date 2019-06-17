import { IFieldsStyle } from '../../dto/IOutStylesDTO';
import { observable } from 'mobx';
import { RGBA } from '../../../../../Shared/types/IRGBA';

export class FieldsStore implements IFieldsStyle {
  @observable backgroundColor: RGBA;
  @observable boxShadow: RGBA;
  @observable color: RGBA;
  @observable borderColor: RGBA;
  @observable borderSize: number;

  @observable primary: RGBA;
  @observable primary25: RGBA;
  @observable primary50: RGBA;

  constructor(data: FieldsStore) {
    this.backgroundColor = new RGBA(data.backgroundColor);
    this.boxShadow = new RGBA(data.boxShadow);
    this.color = new RGBA(data.color);
    this.borderColor = new RGBA(data.borderColor);
    this.borderSize = data.borderSize;

    this.primary = new RGBA(data.primary);
    this.primary25 = new RGBA(data.primary25);
    this.primary50 = new RGBA(data.primary50);
  }
}