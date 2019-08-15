import * as React from 'react';
import Input from '../../../../../../Shared/components/Inputs/Input';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';
import { observer } from 'mobx-react';
import InputDate from '../../../../../../Shared/components/Inputs/InputDate';

@observer
class PreviewInput extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    return(
      <div className='row justify-content-center'>
        <Input label='Input' colors={this.color.styles.input} />
        <InputDate
          label='InputDate'
          name='test' onChange={() => {}}
          colors={this.color.styles.input}
          placeholder='DD.MM.YYYY'
          className='ml-3 mr-3'
          mask='**.**.****'
          maskChar={null}
        />
      </div>
    );
  }
}

export default PreviewInput;
