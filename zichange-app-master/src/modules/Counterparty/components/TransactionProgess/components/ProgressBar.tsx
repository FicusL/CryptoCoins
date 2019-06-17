import * as React from 'react';
import classNames from 'classnames';
import { RGBA } from '../../../../Shared/types/IRGBA';
import { lazyInject } from '../../../../IoC';
import { ColorStore } from '../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { observer } from 'mobx-react';
import { FormattedMessage } from '../../../../../react-intl-helper';

export interface IProps {
  steps: string[];
  stepIndex: number;
  className?: string;
}

@observer
class ProgressBar extends React.Component<IProps> {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    const { steps, stepIndex, className } = this.props;

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

    const progressWidth = 100 / (steps.length - 1) * stepIndex;

    return(
      <div className='container'>
        <div className='progress undefined' style={{zIndex: 100}}>
          <div className='progress__bar' style={{
            backgroundColor: RGBA.toRGBAString(this.color.styles.progressBar.backgroundColor),
          }}>
            <div className='amount-complete'
                 style={{ width: `${progressWidth}%`, backgroundColor: RGBA.toRGBAString(this.color.styles.progressBar.primary25) }} />
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

export default ProgressBar;