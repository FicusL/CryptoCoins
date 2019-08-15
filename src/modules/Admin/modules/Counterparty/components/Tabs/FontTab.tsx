import * as React from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import { IFieldsStyle } from '../../dto/IOutStylesDTO';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

interface IProps {
  colors: IFieldsStyle;
  callback: (color) => void;
}

@observer
class FontTab extends React.Component<IProps> {

  styles : IFieldsStyle = observable({
    backgroundColor: this.props.colors.backgroundColor,
    boxShadow: this.props.colors.boxShadow,
    border: this.props.colors.borderColor,
    color: this.props.colors.color,
  });

  componentWillUpdate(): void {
    this.props.callback(this.styles);
  }

  render() {

    const { colors } = this.props;

    return(
      <div>
        <div className='container'>
          <div className='d-flex flex-column'>
            <ColorPicker callback={(color) => this.styles.color = color}
                         label='Color'
                         defaultColor={colors.color} />
          </div>
        </div>
      </div>
    );
  }
}

export default FontTab;