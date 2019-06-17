import * as React from 'react';
import Button from '../../../../../../Shared/components/Buttons/Button';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';

@observer
class PreviewButton extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    return(
      <div className='row justify-content-center'>
        <Button name='default' type='button' colors={this.color.styles.button}>
          Some Text..
        </Button>
      </div>
    );
  }
}

export default PreviewButton;