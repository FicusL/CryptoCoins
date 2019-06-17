import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

export interface IProps {
  steps: string[];
  stepIndex: number;
  className?: string;
}

class ProgressBar extends React.Component<IProps> {

  render() {
    const { steps, stepIndex, className } = this.props;

    const checkpoints = [];
    const labels = [];

    steps.forEach((step, i) => {
      checkpoints.push(<span key={i} className={classNames('checkpoint', { 'completed': i <= stepIndex })} />);
      labels.push(<h4 key={i} className='label'>{step}</h4>);
    });

    const progressWidth = 100 / (steps.length - 1) * stepIndex;

    return (
      <div className={`progress ${className}`}>
        <div className='progress__bar'>
          <div className='amount-complete' style={{ width: `${progressWidth}%` }} />
        </div>
        <div className='progress__labels'>{labels}</div>
        <div className='progress__checkpoints'>{checkpoints}</div>
      </div>
    );
  }
}

export default ProgressBar;
