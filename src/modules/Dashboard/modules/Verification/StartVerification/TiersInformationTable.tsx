import * as React from 'react';
import { FormattedMessage } from 'react-intl';

class TiersInformationTable extends React.Component {

  render() {
    return (
      <div className='container row no-gutters tiers p-0'>
        <div className='col-12 col-md-6 col-lg-4 text--center'>
          <div className='tiers__tier'>
            <FormattedMessage id='dashboard.kyc.tier1' defaultMessage='Tier 1'/>
          </div>

          <div className='tiers__volume'>
            <FormattedMessage id='dashboard.kyc.transactionsVolume' defaultMessage='Transactions volume:'/>
            <br/>
            <FormattedMessage id='dashboard.kyc.tier1Volume' defaultMessage='up to € 15 000 per year'/>
          </div>
        </div>

        <div className='col-12 col-md-6 col-lg-4 text--center'>
          <div className='tiers__tier'>
            <FormattedMessage id='dashboard.kyc.tier2' defaultMessage='Tier 2'/>
          </div>

          <div className='tiers__volume'>
            <FormattedMessage id='dashboard.kyc.transactionsVolume' defaultMessage='Transactions volume:'/>
            <br/>
            <FormattedMessage id='dashboard.kyc.tier2Volume' defaultMessage='€ 15 001 –  € 100 000 per year'/>
          </div>
        </div>

        <div className='col-12 col-md-12 col-lg-4 text--center'>
          <div className='tiers__tier'>
            <FormattedMessage id='dashboard.kyc.tier3' defaultMessage='Tier 3'/>
          </div>

          <div className='tiers__volume'>
            <FormattedMessage id='dashboard.kyc.transactionsVolume' defaultMessage='Transactions volume:'/>
            <br/>
            <FormattedMessage id='dashboard.kyc.tier3Volume' defaultMessage='€ 100 001+ per year'/>
          </div>
        </div>

      </div>
    );
  }
}

export default TiersInformationTable;