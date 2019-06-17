import './style.scss';
import * as React from 'react';
import cn from 'classnames';
import { IOnChangeProps } from '../../../types/IChangeProps';

interface IProps {
  name: string;
  values: [string, string];
  onChange: (changeProps: IOnChangeProps) => void;
  label?: string;
  toggled?: boolean;
  className?: string;
}

interface IState {
  toggled: boolean;
}

class Toggle extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      toggled: !!props.toggled,
    };
  }

  toggle = () => {
    this.setState({ toggled: !this.state.toggled },  () => {
      const { name, values } = this.props;
      this.props.onChange({
        name,
        value: this.state.toggled ? values[1] : values[0],
      });
    });
  };

  render() {
    const { values } = this.props;
    const { toggled } = this.state;
    const label = toggled ? values[1] : values[0];

    return (
      <div className={cn('toggle__container', this.props.className)} onClick={this.toggle}>
        <div className={cn('toggle__switch', { 'toggled': this.state.toggled })}>
          <span>{label}</span>
        </div>
      </div>
    );
  }
}

export default Toggle;