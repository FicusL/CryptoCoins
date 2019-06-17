import { observer } from 'mobx-react';
import * as React from 'react';
import PreviewProgressBar from './PreviewComponents/PreviewProgressBar';
import ColorPicker from '../ColorPicker/ColorPicker';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';
import SliderContainer from '../Slider/SliderContainer';

@observer
class ProgressBarTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    console.log('progressBar: ', this.color.styles.progressBar);

    return(
        <div className='container'>
          <PreviewProgressBar />
          <div className='container mt-5'>
            <div className='d-flex flex-column'>
              <p className='text--center m-0 mt-2'
                 style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
                Common
              </p>

              <div className='container'>
                <hr style={{
                  height: '2px',
                  backgroundColor: '#098',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
                }} />
              </div>
              <ColorPicker callback={(color) => this.color.styles.progressBar.backgroundColor = color}
                           label='backgroundColor'
                           defaultColor={this.color.styles.progressBar.backgroundColor} />
              <SliderContainer defaultSize={this.color.styles.progressBar.borderSize}
                               callback={(size) => this.color.styles.progressBar.borderSize = size}/>

              <p className='text--center m-0 mt-2'
                 style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
                Primary
              </p>

              <div className='container'>
                <hr style={{
                  height: '2px',
                  backgroundColor: '#098',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
                }} />
              </div>

              <ColorPicker callback={(color) => this.color.styles.progressBar.primary = color}
                           label='Checkpoint'
                           defaultColor={this.color.styles.progressBar.primary} />

              <ColorPicker callback={(color) => this.color.styles.progressBar.primary25 = color}
                           label='Completed'
                           defaultColor={this.color.styles.progressBar.primary25} />
            </div>
          </div>

        </div>
    );
  }
}

export default ProgressBarTab;