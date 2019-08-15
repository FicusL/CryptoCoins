import * as React from 'react';
import { lazyInject } from '../../../../../IoC';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { MainPartnersStore } from '../store/parts/MainPartnersStore';
import CloseIcon from '../../../../../Shared/components/CloseIcon/CloseIcon';
import Button from '../../../../../Shared/components/Buttons/Button';
import PartnerDataForm from './PartnerDataForm';
import { observer } from 'mobx-react';

@observer
class MainPartners extends React.Component<InjectedIntlProps> {
  @lazyInject(MainPartnersStore)
  store: MainPartnersStore;

  render() {
    const { intl } = this.props;
    const { partners } = this.store;

    return (
      <div>
        {partners.map((partner, i) => (
          <div className='tier1__form-section' key={i} style={{ position: 'relative' }}>
            {i !== 0 && <CloseIcon right='0' onClick={() => this.store.removePartner(i)}/>}
            <h2 className='header mb-4 text--center'>
              { intl.formatMessage({
                  id: 'dashboard.kyc.legal.partners.partner',
                  defaultMessage: 'Partner ',
              })}
              {i + 1}
            </h2>
            <PartnerDataForm
              values={partner.values}
              errors={partner.errors}
              onChange={partner.change}
            />
          </div>
        ))}
        <div className='container row justify-content-center mb-5'>
          <Button name='white' onClick={this.store.addPartner} style={{ float: 'left' }}>
            { intl.formatMessage({
              id: 'dashboard.kyc.legal.partners.button',
              defaultMessage: 'Add',
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(MainPartners);
