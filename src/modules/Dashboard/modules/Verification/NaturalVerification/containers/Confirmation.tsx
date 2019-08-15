import * as React from 'react';
import CheckBox from '../../../../../Shared/components/Inputs/Checkbox/Checkbox';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { ConfirmationStore } from '../stores/parts/ConfirmationStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';
import { ColorStore } from '../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { CounterpartyAccountStore } from '../../../../../Counterparty/stores/CounterpartyAccountStore';

@observer
class Confirmation extends React.Component<InjectedIntlProps> {
  @lazyInject(ConfirmationStore)
  readonly store: ConfirmationStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  color: ColorStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  componentWillMount(): void {
    this.store.loadLocalStorage();
  }

  handleChange = ({name, value}) => {
    this.store.change(name, value);
    window.localStorage.setItem(name, value);
  };

  render() {
    const { intl } = this.props;
    return (
      <div className='tier1 confirmation'>
        <div className='row tier1__form-section'>
          <h2 className='header col-12 mb-4'>
            {
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.confirmationTitle',
                defaultMessage: 'By clicking \'Complete KYC\' button this questionnaire',
              })
            }
          </h2>
          <CheckBox
            name='accurateInfo'
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.confirmation.accurateInfoLabel',
                defaultMessage: 'I confirm that the information provided in this questionnaire is current, ' +
                  'complete and accurate',
              })
            }
            checked={this.store.values.accurateInfo}
            onChange={this.handleChange}
            showError={!!this.store.errors.accurateInfo}
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.checkBox}
          />
          <CheckBox
            name='notifyBaGukAboutIncorrectInfo'
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.confirmation.notifyBaGukAboutIncorrectInfoLabel',
                defaultMessage: 'I undertake to notify BaGuk Finance OÜ within 15 days of any changes in the ' +
                  'circumstances in which the information provided herein is deemed to be incorrect, ' +
                  'incomplete, or obsolete',
              })
            }
            checked={this.store.values.notifyBaGukAboutIncorrectInfo}
            onChange={this.handleChange}
            showError={!!this.store.errors.notifyBaGukAboutIncorrectInfo}
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.checkBox}
          />
          <CheckBox
            name='processingPersonalData'
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.confirmation.processingPersonalDataLabel',
                defaultMessage: 'I confirm that I am aware of my responsibility to provide correct data. ' +
                  'I consent to the processing of my personal data',
              })
            }
            checked={this.store.values.processingPersonalData}
            onChange={this.handleChange}
            showError={!!this.store.errors.processingPersonalData}
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.checkBox}
          />
          <CheckBox
            name='BaGukTransferIdentificationData'
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.confirmation.BaGukTransferIdentificationDataLabel',
                defaultMessage: 'I permit BaGuk Finance OÜ (location: Narva mnt 13, Tallinn 10151, Estonia, ' +
                  'registration code 14432499) to transfer the Customer\'s identification data contained in the ' +
                  'Customer Identification Form, including name information (name of the Customer, passport data, ' +
                  'place of registration / location, etc.), to the regulatory authorities, in order to comply with ' +
                  'the requirements of applicable law, including with regard to combating the ' +
                  'legalization (laundering) of proceeds from crime and financing of terrorism, as well as ' +
                  'reporting to the tax authorities',
              })
            }
            checked={this.store.values.BaGukTransferIdentificationData}
            onChange={this.handleChange}
            showError={!!this.store.errors.BaGukTransferIdentificationData}
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.checkBox}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(Confirmation);