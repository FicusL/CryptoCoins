import { observer } from 'mobx-react';
import * as React from 'react';
import PreviewRadioButton from './PreviewComponents/PreviewRadioButton';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';
import ColorPicker from '../ColorPicker/ColorPicker';
import SliderContainer from '../Slider/SliderContainer';

@observer
class RadioButtonTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <div className='container'>
        <PreviewRadioButton />
        <ColorPicker callback={(color) => this.color.styles.radioButton.borderColor = color}
                     label='borderColor'
                     defaultColor={this.color.styles.radioButton.borderColor} />
        <ColorPicker callback={(color) => this.color.styles.radioButton.color = color}
                     label='color'
                     defaultColor={this.color.styles.radioButton.color} />
        <SliderContainer defaultSize={this.color.styles.radioButton.borderSize}
                         callback={(size) => this.color.styles.radioButton.borderSize = size}/>
      </div>
    );
  }
}

export default RadioButtonTab;