import * as React from 'react';
import PreviewInput from './PreviewComponents/PreviewInput';
import ColorPicker from '../ColorPicker/ColorPicker';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';
import { observer } from 'mobx-react';
import SliderContainer from '../Slider/SliderContainer';

@observer
class InputsTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <div className='container'>
        <PreviewInput />
        <ColorPicker callback={(color) => this.color.styles.input.backgroundColor = color}
                     label='backgroundColor'
                     defaultColor={this.color.styles.input.backgroundColor} />
        <ColorPicker callback={(color) => this.color.styles.input.color = color}
                     label='color'
                     defaultColor={this.color.styles.input.color} />
        <ColorPicker callback={(color) => this.color.styles.input.boxShadow = color}
                     label='boxShadow'
                     defaultColor={this.color.styles.input.boxShadow} />
        <ColorPicker callback={(color) => this.color.styles.input.borderColor = color}
                     label='borderColor'
                     defaultColor={this.color.styles.input.borderColor} />
        <SliderContainer defaultSize={this.color.styles.input.borderSize}
                         callback={(size) => this.color.styles.input.borderSize = size}/>
      </div>
    );
  }
}

export default InputsTab;