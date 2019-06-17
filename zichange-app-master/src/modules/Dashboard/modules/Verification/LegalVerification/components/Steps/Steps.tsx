import './style.scss';
import * as React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

interface IProps {
  steps: string[];
  active: number;
}

@observer
class Steps extends React.Component<IProps & InjectedIntlProps> {

  render() {
    const { intl, steps, active } = this.props;

    return (
      <div className='kyc__steps'>
        {steps.map((step, i) => (
          <div key={i} className={cn('step', {'step--active': i === active})}>
            <span className={cn(i === 4 || i === 5 ? 'pr-3' : '')}>
              {intl.formatMessage({
                id: step,
              })}
            </span>
            <span>{i + 1}/{steps.length}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default injectIntl(Steps);
