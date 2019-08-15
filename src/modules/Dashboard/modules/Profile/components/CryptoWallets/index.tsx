import * as React from 'react';
import { ICryptoWallet } from '../../interfaces/ICryptoWallet';
import { observer } from 'mobx-react';
import Button from '../../../../../Shared/components/Buttons/Button';
import { FormattedMessage } from 'react-intl';

interface IProps {
  wallets: Map<number, ICryptoWallet>;
  onWalletClick: (wallet: ICryptoWallet) => void;
  onAddWalletClick: () => void;
  onCrossClick: (wallet: ICryptoWallet) => void;
}

@observer
class BtcWallets extends React.Component<IProps> {

  onCrossClickHandler = (e, wallet) => {
    e.stopPropagation();
    this.props.onCrossClick(wallet);
  };

  render() {
    const { wallets, onAddWalletClick, onWalletClick } = this.props;
    const walletsArray = Array.from(wallets.values());

    return (
      <div>
        {walletsArray.length !== 0 ?
          <div>
            {walletsArray.map((wallet, i) => (
              <div key={i} className='account__details-value clickable' onClick={() => onWalletClick(wallet)}>
                <h4>
                  <span className='pr-3'>₿</span>
                  {wallet.label}, {wallet.address}
                  <span className='cross' onClick={(target) => this.onCrossClickHandler(target, wallet)} />
                </h4>
              </div>
            ))}
          </div>
          :
          <div className='account__details-value'>
            <FormattedMessage id='dashboard.settings.haveNoWallets'
                              defaultMessage='You have no connected wallets'
            />
          </div>
        }
        <div className='text-right mt-4'>
          <Button name='white' onClick={onAddWalletClick}>
            <FormattedMessage id='dashboard.settings.addNewWallet'
                              defaultMessage='Add new wallet'
            />
          </Button>
        </div>
      </div>
    );
  }
}

export default BtcWallets;