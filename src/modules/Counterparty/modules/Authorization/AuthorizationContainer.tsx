import * as React from 'react';
import { lazyInject } from '../../../IoC';
import { ModalStore } from '../../../Modals/store/ModalStore';
import AuthorizationModal from './modals/AuthorizationModal';

class AuthorizationContainer extends React.Component {

  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  render() {
    return(
      <>
        <AuthorizationModal />
      </>
    );
  }
}

export default AuthorizationContainer;