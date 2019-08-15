import { injectable } from 'inversify';
import { action, computed, observable } from 'mobx';
import { IAvailableModals } from '../interfaces/IAvailableModals';

interface IOpenedModal {
  name: keyof IAvailableModals;
  props: any;
}

@injectable()
export class ModalStore {
  @observable private _openedModals: IOpenedModal[] = [];

  @computed
  get openedModals(): IOpenedModal[] {
    return this._openedModals;
  }

  @action
  openModal(name: (keyof IAvailableModals) | any, props?: any) {
    this._openedModals.push({ name, props });
  }

  @action
  changeModalProps(name: keyof IAvailableModals, props: any) {
    const i = this._openedModals.findIndex(modal => modal.name === name);
    this._openedModals[i].props = props;
  }

  @action
  updateModalProps(name: keyof IAvailableModals, props: any) {
    const i = this._openedModals.findIndex(modal => modal.name === name);
    this._openedModals[i].props = { ...this._openedModals[i].props, ...props };
  }

  @action
  closeModal(name: keyof IAvailableModals) {
    this._openedModals = this._openedModals.filter(modal => modal.name !== name);
  }
}