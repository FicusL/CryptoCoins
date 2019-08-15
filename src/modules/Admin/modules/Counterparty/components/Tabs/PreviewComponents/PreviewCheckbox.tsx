import * as React from 'react';
import CheckBox from '../../../../../../Shared/components/Inputs/Checkbox/Checkbox';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';

@observer
class PreviewCheckbox extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <CheckBox
        name='test'
        label='I confirm that the information provided in this questionnaire is current, complete and accurate'
        onChange={() => {}}
        colors={this.color.styles.checkBox}
        checked
      />
    );
  }
}

export default PreviewCheckbox;