import * as React from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import { observer } from 'mobx-react';
import PreviewBody from './PreviewComponents/PreviewBody';
import { ColorStore } from '../../stores/Colors/ColorStore';
import { lazyInject } from '../../../../../IoC';


@observer
class BackgroundTab extends React.Component {

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  render() {

    return(
      <div>
        <div className='container'>
          <PreviewBody />
          <div className='d-flex flex-column'>
            <ColorPicker callback={(color) => this.colorStore.styles.body.backgroundColor = color}
                         defaultColor={this.colorStore.styles.body.backgroundColor}
                         label='Background'/>
            <ColorPicker callback={(color) => this.colorStore.styles.body.color = color}
                         defaultColor={this.colorStore.styles.body.color}
                         label='Font Color'/>
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundTab;