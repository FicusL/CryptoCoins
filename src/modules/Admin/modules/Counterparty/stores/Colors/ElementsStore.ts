import { IOutStylesDTO } from '../../dto/IOutStylesDTO';
import { observable } from 'mobx';
import { FieldsStore } from './FieldsStore';
import { SelectSearchFieldsStore } from './SelectSearchFieldsStore';

export class ElementsStore implements IOutStylesDTO {
  @observable body;
  @observable header;
  @observable button;
  @observable input;
  @observable text;
  @observable selectSearch;
  @observable radioButton;
  @observable progressBar;
  @observable checkBox;

  constructor(data: ElementsStore) {
    this.body = new FieldsStore(data.body);
    this.header = new FieldsStore(data.header);
    this.text = new FieldsStore(data.text);
    this.button = new FieldsStore(data.button);
    this.input = new FieldsStore(data.input);
    this.radioButton = new FieldsStore(data.radioButton);
    this.selectSearch = new SelectSearchFieldsStore(data.selectSearch);
    this.progressBar = new FieldsStore(data.progressBar);
    this.checkBox = new FieldsStore(data.checkBox);
  }
}