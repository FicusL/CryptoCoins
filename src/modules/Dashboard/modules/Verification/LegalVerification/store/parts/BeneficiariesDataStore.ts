import { action, observable } from 'mobx';
import { PersonStore, PersonValues } from './PersonStore';
import { injectable } from 'inversify';

@injectable()
export class BeneficiariesDataStore {
  @observable persons: PersonStore[] = [new PersonStore()];

  get values() {
    return {
      persons: this.persons.map(person => ({
        ...person.values,
        birthDate: person.values.birthDate && person.values.birthDate.toDateString(),
      })),
    };
  }

  get errors() {
    return this.persons.map(person => person.errors);
  }

  @action
  addPerson = () => {
    this.persons.push(new PersonStore());
  };

  @action
  removePerson = (i: number) => {
    this.persons.splice(i, 1);
  };

  @action
  change = (personIndex: number, name: keyof PersonValues, value: string) => {
    this.persons[personIndex].change(name, value);
  };

  @action
  validate = async () => {
    const validationPromises = this.persons.map(person => person.validate());
    const validationResults = await Promise.all(validationPromises);

    return validationResults.every(result => result);
  }
}