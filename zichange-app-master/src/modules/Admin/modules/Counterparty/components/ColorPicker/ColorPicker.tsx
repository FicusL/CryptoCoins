import * as React from 'react';
import { SketchPicker } from 'react-color';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './style.scss';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';
import { RGBA } from '../../../../../Shared/types/IRGBA';

interface IProps {
  label: string;
  defaultColor: RGBA;
  callback?: (color) => void;
}

@observer
class ColorPicker extends React.Component<IProps> {

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  @observable displayColorPicker = false;
  @observable hexColor: string;
  @observable color: RGBA;

  componentWillMount(): void {
    this.color = this.props.defaultColor;
    this.hexColor = RGBA.toHEX(this.color);
  }

  onChangeColor = (color) => {
    this.color = color.rgb;
    this.hexColor = color.hex;

    this.props.callback(this.color);
  };

  handleClick = () => {
    this.displayColorPicker = !this.displayColorPicker;
  };

  handleClose = () => {
    this.displayColorPicker = false;
  };

  render() {

    return(
      <div className='color-picker mt-3 mb-3'>
        <div className='d-flex'>
          <div className='text-right color-picker-label mt-1'>
            <p className='p-0 m-0'>{this.props.label}:</p>
          </div>

          {/*<Input.Group className='d-flex' style={{maxWidth: '420px'}} compact>*/}
            {/*<Input className='col color-picker-input' value={RGBA.toRGBAString(this.color)} />*/}
            {/*<Input className='col color-picker-input' value={this.hexColor} />*/}
          {/*</Input.Group>*/}

          <div className='color-picker-swatch ml-2' onClick={this.handleClick}>
            <div className='color-picker-block'
                  style={
                    {backgroundColor: RGBA.toRGBAString(this.color)}
                  }/>
          </div>
          { this.displayColorPicker ? <div className='color-picker-popover ml-2'>
            <div className='color-picker-cover' onClick={this.handleClose}/>
            <SketchPicker color={this.color} onChange={this.onChangeColor} />
          </div> : null }
        </div>
      </div>
    );
  }
}

export default ColorPicker;