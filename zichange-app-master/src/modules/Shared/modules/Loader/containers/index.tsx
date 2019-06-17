import React from 'react';
import classNames from 'classnames';

import './style.scss';
import { lazyInject } from '../../../../IoC';
import { LoaderStore } from '../store/LoaderStore';
import { observer } from 'mobx-react';

@observer
export default class Loader extends React.Component {
  @lazyInject(LoaderStore)
  private readonly store: LoaderStore;

  render() {

    const { children } = this.props;
    const { isLoaderActive } = this.store;

    return (
      <div>
        <div className={classNames({'blur': this.store.isLoaderActive})}>
          {children}
        </div>
        {isLoaderActive &&
          <div id='preloader'>
            <div id='loader' />
          </div>
        }
      </div>
    );
  }
}
