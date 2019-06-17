import * as React from 'react';
import { observer } from 'mobx-react';
import PreviewCheckbox from './PreviewComponents/PreviewCheckbox';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';
import ColorPicker from '../ColorPicker/ColorPicker';
import SliderContainer from '../Slider/SliderContainer';

@observer
class CheckboxTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <div className='container'>
        <PreviewCheckbox />
        <ColorPicker callback={(color) => this.color.styles.checkBox.borderColor = color}
                     label='borderColor'
                     defaultColor={this.color.styles.checkBox.borderColor} />
        <ColorPicker callback={(color) => this.color.styles.checkBox.color = color}
                     label='color'
                     defaultColor={this.color.styles.checkBox.color} />
        <SliderContainer defaultSize={this.color.styles.checkBox.borderSize}
                         callback={(size) => this.color.styles.checkBox.borderSize = size}/>
      </div>
    );
  }
}

export default CheckboxTab;