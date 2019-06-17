import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { action, observable } from 'mobx';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';
import { RGBA } from '../../../../../Shared/types/IRGBA';
import { CounterpartyAccountStore } from '../../../../../Counterparty/stores/CounterpartyAccountStore';
import { SessionStore } from '../../../../../Shared/stores/SessionStore';
import { FieldsStore } from './FieldsStore';
import { ElementsStore } from './ElementsStore';
import { SelectSearchFieldsStore } from './SelectSearchFieldsStore';

export const REQUEST_FETCH_STYLE_TASK = 'REQUEST_FETCH_STYLE_TASK';

@injectable()
export class ColorStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @inject(SessionStore)
  sessionStore: SessionStore;

  @inject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  readonly defaultColors : FieldsStore = {
    backgroundColor: RGBA.defaultColor,
    boxShadow: RGBA.defaultColor,
    color: RGBA.defaultColor,
    borderColor: RGBA.defaultColor,
    borderSize: 0,

    primary: RGBA.defaultColor,
    primary25: RGBA.defaultColor,
    primary50: RGBA.defaultColor,
  };

  readonly defaultSelectSearchColors : SelectSearchFieldsStore = {
    control: this.defaultColors,
    singleValue: this.defaultColors,
    menu: this.defaultColors,
    themes: this.defaultColors,
  };

  @observable styles: ElementsStore = {
    button: this.defaultColors,
    body: this.defaultColors,
    header: this.defaultColors,
    text: this.defaultColors,
    input: this.defaultColors,
    radioButton: this.defaultColors,
    selectSearch: this.defaultSelectSearchColors,
    progressBar: this.defaultColors,
    checkBox: this.defaultColors,
  };

  @observable isLoaded = false;

  // TODO: посмотреть, нужен ли этот метод вообще
  @action
  fromHEXtoRGB(color : string) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  @action
  async addStyles(styles: ElementsStore) {
    await this.api.post('/counterparties/styles', styles);
    this.styles = styles;
  }

  @action
  async getStyles() {
    this.loaderStore.addTask(REQUEST_FETCH_STYLE_TASK);
    try {
      const styles = await this.api.get(`/counterparties/${this.counterpartyAccountStore.isAgent ?
        this.counterpartyAccountStore.accountId : this.sessionStore.accountId}/styles`);

      this.styles = new ElementsStore({
        body: styles.body || this.defaultColors,
        button: styles.button || this.defaultColors,
        input: styles.input || this.defaultColors,
        text: styles.text || this.defaultColors,
        header: styles.header || this.defaultColors,
        selectSearch: styles.selectSearch || this.defaultSelectSearchColors,
        radioButton: styles.radioButton || this.defaultColors,
        progressBar: styles.progressBar || this.defaultColors,
        checkBox: styles.checkBox || this.defaultColors,
      });

      this.isLoaded = true;
      this.loaderStore.removeTask(REQUEST_FETCH_STYLE_TASK);
    } catch (e) {
      this.loaderStore.removeTask(REQUEST_FETCH_STYLE_TASK);
    }
  }
}