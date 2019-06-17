import React from 'react';
import TypeKycContainer from '../../containers/TypeKycContainer';
import { IInKycFiltersDTO } from '../../dto/IInKycFiltersDTO';
import { KycStatus } from '../../../../../Dashboard/modules/Profile/constants/KycStatus';
import { lazyInject } from '../../../../../IoC';
import { KycStore } from '../../stores/KycStore';

class KycRejected extends React.Component {

  @lazyInject(KycStore)
  store: KycStore;

  render() {

    const filters: IInKycFiltersDTO =
      { statuses: [KycStatus.Tier1Rejected, KycStatus.Tier2Rejected, KycStatus.Tier3Rejected] };

    return(
      <TypeKycContainer filters={filters} />
    );
  }
}

export default KycRejected;