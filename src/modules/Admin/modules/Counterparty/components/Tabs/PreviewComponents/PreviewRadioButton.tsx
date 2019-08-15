import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';
import RadioButton from '../../../../../../Shared/components/Inputs/RadioButton/RadioButton';

@observer
class PreviewRadioButton extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <div className='row justify-content-center'>
        <RadioButton
          name='representedByThirdParty'
          value='yes'
          label='Yes'
          colors={this.color.styles.radioButton}
        />
      </div>
    );
  }
}

export default PreviewRadioButton;