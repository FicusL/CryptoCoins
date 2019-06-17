import { observable } from 'mobx';
import { FieldsStore } from './FieldsStore';
import { ISelectSearchFields } from '../../dto/IOutStylesDTO';

export class SelectSearchFieldsStore implements ISelectSearchFields {
  @observable control : FieldsStore;
  @observable singleValue: FieldsStore;
  @observable menu: FieldsStore;
  @observable themes: FieldsStore;

  constructor(data: SelectSearchFieldsStore) {
    this.control = new FieldsStore(data.control);
    this.singleValue = new FieldsStore(data.singleValue);
    this.menu = new FieldsStore(data.menu);
    this.themes = new FieldsStore(data.themes);
  }
}