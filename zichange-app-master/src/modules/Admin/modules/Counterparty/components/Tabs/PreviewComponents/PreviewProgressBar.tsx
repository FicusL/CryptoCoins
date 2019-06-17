import { observer } from 'mobx-react';
import * as React from 'react';
import classNames from 'classnames';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';
import { RGBA } from '../../../../../../Shared/types/IRGBA';
import { TransactionStatus } from '../../../../../../Counterparty/components/TransactionProgess/const/TransactionStatus';
import { FormattedMessage } from '../../../../../../../react-intl-helper';

@observer
class PreviewProgressBar extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    const steps = [
      TransactionStatus.Authorization,
      TransactionStatus.Verification,
      TransactionStatus.Payment,
      TransactionStatus.Status,
    ];

    const stepIndex = 1;
    const checkpoints = [];
    const labels = [];

    steps.forEach((step, i) => {
      checkpoints.push(
        i <= stepIndex ?
        <span key={i} style={{
          backgroundColor: RGBA.toRGBAString(this.color.styles.progressBar.primary),
          border: `${this.color.styles.progressBar.borderSize}px solid ${RGBA.toRGBAString(this.color.styles.progressBar.primary25)}`,
        }} className={classNames('checkpoint', { 'completed': i <= stepIndex })} />
        :
        <span key={i} style={{
          backgroundColor: RGBA.toRGBAString(this.color.styles.progressBar.primary),
          border: `${this.color.styles.progressBar.borderSize}px solid ${RGBA.toRGBAString(this.color.styles.progressBar.backgroundColor)}`,
        }} className={classNames('checkpoint', { 'completed': i <= stepIndex })} />,
      );
      labels.push(<h4 key={i} className='label'><FormattedMessage id={step} /></h4>);
    });

    return(
      <div className='container'>
        <div className='progress undefined' style={{zIndex: 100}}>
          <div className='progress__bar' style={{
            backgroundColor: RGBA.toRGBAString(this.color.styles.progressBar.backgroundColor),
          }}>
            <div className='amount-complete'
                 style={{ width: `${34}%`, backgroundColor: RGBA.toRGBAString(this.color.styles.progressBar.primary25) }} />
          </div>
          <div className='progress__labels'>{labels}</div>
          <div className='progress__checkpoints'>
            {checkpoints}
          </div>
        </div>
      </div>
    );
  }
}

export default PreviewProgressBar;
