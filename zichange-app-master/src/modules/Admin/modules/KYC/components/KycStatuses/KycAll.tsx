import React from 'react';
import TypeKycContainer from '../../containers/TypeKycContainer';
import { lazyInject } from '../../../../../IoC';
import { KycStore } from '../../stores/KycStore';

class KycAll extends React.Component {

  @lazyInject(KycStore)
  store: KycStore;

  render() {

    return(
      <TypeKycContainer />
    );
  }
}

export default KycAll;