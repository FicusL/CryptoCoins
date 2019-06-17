import './style.scss';
import * as React from 'react';
import Button from '../../../../../Shared/components/Buttons/Button';
import { Link } from 'react-router-dom';
import { InjectedIntlProps, injectIntl } from 'react-intl';

class Tier3Container extends React.Component<InjectedIntlProps> {
  render() {
    const { intl } = this.props;

    return (
      <div className='row tier2'>

        <div className='col-12 tier2__guide'>
          <p>
            { intl.formatMessage({
                id: 'dashboard.kyc.tier3.guide.header',
                defaultMessage: 'In order to increase limits please:',
            })}
          </p>
          <br/>

          <ol className='tier2__guide--list'>
            <li>
              { intl.formatMessage({
                  id: 'dashboard.kyc.tier3.guide.step.declaration.download.header',
                  defaultMessage: 'Fill and sign the Declaration on origin of funds ',
              })}
              <br/>
              <Link to={'#'} className='tier2__link tier2__link--download'>
                { intl.formatMessage({
                    id: 'dashboard.kyc.tier3.guide.step.declaration.download.link',
                    defaultMessage: 'Download PDF',
                })}
              </Link>
            </li>
            <li>
              { intl.formatMessage({
                  id: 'dashboard.kyc.tier3.guide.step.declaration.send.header',
                  defaultMessage: 'Send a signed copy of the document to ',
              })}
              <a href='mailto:kyc@baguk.finance' className='tier2__link tier2__link--baguk-finance'>
                { intl.formatMessage({
                    id: 'dashboard.kyc.tier3.guide.step.declaration.send.email',
                    defaultMessage: 'kyc@baguk.finance',
                })}
              </a>
            </li>
          </ol>

          <br/>
          <p>
            { intl.formatMessage({
                id: 'dashboard.kyc.tier3.guide.review.header',
                defaultMessage: 'After reviewing your application we can request additional information.',
            })}
          </p>
        </div>

        <div className='col-12 text-center text-md-right'>
          <Link to='/dashboard'>
            <Button name='white'>
              { intl.formatMessage({
                  id: 'dashboard.kyc.tier3.footer.button.return',
                  defaultMessage: 'Return to dashboard',
              })}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default injectIntl(Tier3Container);