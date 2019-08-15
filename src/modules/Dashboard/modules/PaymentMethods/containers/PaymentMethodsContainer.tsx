import * as React from 'react';
import AdvancedCashForm from '../../../../../modules/Dashboard/modules/PaymentMethods/components/AdvancedCashForm';
import PayeerForm from '../../../../../modules/Dashboard/modules/PaymentMethods/components/PayeerForm';
import RoyalPayForm from '../components/RoyalPayForm';

export default class PaymentMethodsContainer extends React.Component {
  render(): React.ReactNode {
    return (
      <React.Fragment>
        <AdvancedCashForm />
        {/*<PayeerForm />*/}
        <RoyalPayForm />
      </React.Fragment>
    );
  }
}