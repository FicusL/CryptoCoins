import React from 'react';
import TypeKycContainer from '../../containers/TypeKycContainer';
import { IInKycFiltersDTO } from '../../dto/IInKycFiltersDTO';
import { KycStatus } from '../../../../../Dashboard/modules/Profile/constants/KycStatus';
import { lazyInject } from '../../../../../IoC';
import { KycStore } from '../../stores/KycStore';

class KycApproved extends React.Component {

  @lazyInject(KycStore)
  store: KycStore;

  render() {

    const filters: IInKycFiltersDTO =
      { statuses: [KycStatus.Tier1Approved, KycStatus.Tier2Approved, KycStatus.Tier3Approved] };

    return(
      <TypeKycContainer filters={filters}/>
    );
  }
}

export default KycApproved;