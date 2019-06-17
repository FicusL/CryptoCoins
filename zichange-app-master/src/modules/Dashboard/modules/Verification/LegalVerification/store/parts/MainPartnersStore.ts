import { action, observable } from 'mobx';
import { PartnerStore, PartnerValues } from './PartnerStore';
import { injectable } from 'inversify';

@injectable()
export class MainPartnersStore {
  @observable partners: PartnerStore[] = [new PartnerStore()];

  get values() {
    return { partners: this.partners.map(partner => partner.values) };
  }

  get errors() {
    return this.partners.map(partner => partner.errors);
  }

  @action
  addPartner = () => {
    this.partners.push(new PartnerStore());
  };

  @action
  removePartner = (i: number) => {
    this.partners.splice(i, 1);
  };

  @action
  change = (partnerIndex: number, name: keyof PartnerValues, value: string) => {
    this.partners[partnerIndex].change(name, value);
  };

  @action
  validate = async () => {
    const validationPromises = this.partners.map(partner => partner.validate());
    const validationResults = await Promise.all(validationPromises);

    return validationResults.every(result => result);
  }
}