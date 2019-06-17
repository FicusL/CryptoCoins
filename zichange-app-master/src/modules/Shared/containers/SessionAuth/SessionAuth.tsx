import * as React from 'react';
import { observer } from 'mobx-react';
import { SessionStore } from '../../stores/SessionStore';
import { lazyInject } from '../../../IoC';

@observer
export default class SessionAuth extends React.Component {
  @lazyInject(SessionStore)
  private readonly sessionStore: SessionStore;

  public componentWillMount() {
    this.sessionStore.refresh();
  }

  public render() {
    const { isLoaded } = this.sessionStore;
    if (isLoaded) {
      return this.props.children;
    } else {
      return null;
    }
  }
}