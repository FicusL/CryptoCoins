import { action, computed, observable } from 'mobx';
import { injectable } from 'inversify';

@injectable()
export class LoaderStore {
  @computed
  get isLoaderActive() {
    return this._tasks.size > 0;
  }

  @observable _tasks = new Map<string, boolean>();

  @action
  addTask(task: string) {
    this._tasks.set(task, true);
  }

  @action
  removeTask(task: string) {
    this._tasks.delete(task);
  }

  hasTask(task: string) {
    return this._tasks.has(task);
  }
}