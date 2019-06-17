import * as React from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import { PreviewNavbar } from './PreviewComponents/Navbar/PreviewNavbar';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';
import LogoLoader from '../LogoLoader/LogoLoader';

@observer
class HeaderTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    return(
      <div className='container'>
        <PreviewNavbar />
        <div className='container mt-5'>
          <div className='d-flex flex-column'>

            <p className='text--center m-0 mt-2'
               style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Logo
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>

            <div className='container d-flex justify-content-center mt-2'>
              <LogoLoader/>
            </div>

            <p className='text--center m-0 mt-2'
               style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Body
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>

            <ColorPicker callback={(color) => this.color.styles.header.backgroundColor = color}
                         label='backgroundColor'
                         defaultColor={this.color.styles.header.backgroundColor} />

            <ColorPicker callback={(color) => this.color.styles.header.boxShadow = color}
                         label='boxShadow'
                         defaultColor={this.color.styles.header.boxShadow} />

            <p className='text--center m-0 mt-2'
                style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Powered by Zichain
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>


            <ColorPicker callback={(color) => this.color.styles.header.color = color}
                         label='color'
                         defaultColor={this.color.styles.header.color} />
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderTab;