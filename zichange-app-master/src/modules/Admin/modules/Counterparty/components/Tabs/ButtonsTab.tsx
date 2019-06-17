import * as React from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import PreviewButton from './PreviewComponents/PreviewButton';
import SliderContainer from '../Slider/SliderContainer';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';

@observer
class ButtonsTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    return(
      <div className='container'>
        <div className='d-flex flex-column'>
          <PreviewButton />
          <ColorPicker callback={(color) => this.color.styles.button.backgroundColor = color}
                       label='backgroundColor'
                       defaultColor={this.color.styles.button.backgroundColor} />
          <ColorPicker callback={(color) => this.color.styles.button.color = color}
                       label='color'
                       defaultColor={this.color.styles.button.color} />
          <ColorPicker callback={(color) => this.color.styles.button.boxShadow = color}
                       label='boxShadow'
                       defaultColor={this.color.styles.button.boxShadow} />
          <ColorPicker callback={(color) => this.color.styles.button.borderColor = color}
                       label='border'
                       defaultColor={this.color.styles.button.borderColor} />

          <SliderContainer defaultSize={this.color.styles.button.borderSize}
                           callback={(size) => this.color.styles.button.borderSize = size}/>
        </div>
      </div>
    );
  }
}

export default ButtonsTab;