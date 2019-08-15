import * as React from 'react';
import PreviewSelectSearch from './PreviewComponents/PreviewSelectSearch';
import ColorPicker from '../ColorPicker/ColorPicker';
import SliderContainer from '../Slider/SliderContainer';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { ColorStore } from '../../stores/Colors/ColorStore';

@observer
class SelectSearchTab extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <div className='container'>
        <PreviewSelectSearch />
        <div className='container mt-5'>
          <div className='d-flex flex-column'>
            <p className='text--center m-0 mt-2'
               style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Control
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>

            <ColorPicker callback={(color) => this.color.styles.selectSearch.control.backgroundColor = color}
                         label='backgroundColor'
                         defaultColor={this.color.styles.selectSearch.control.backgroundColor} />
            <ColorPicker callback={(color) => this.color.styles.selectSearch.control.color = color}
                         label='color'
                         defaultColor={this.color.styles.selectSearch.control.color} />
            <ColorPicker callback={(color) => this.color.styles.selectSearch.control.borderColor = color}
                         label='borderColor'
                         defaultColor={this.color.styles.selectSearch.control.borderColor} />
            <SliderContainer defaultSize={this.color.styles.selectSearch.control.borderSize}
                             callback={(size) => this.color.styles.selectSearch.control.borderSize = size}/>

            <p className='text--center m-0 mt-2'
               style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Single Value
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>

            <ColorPicker callback={(color) => this.color.styles.selectSearch.singleValue.color = color}
                         label='color'
                         defaultColor={this.color.styles.selectSearch.singleValue.color} />

            <p className='text--center m-0 mt-2'
               style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Menu
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>

            <ColorPicker callback={(color) => this.color.styles.selectSearch.menu.backgroundColor = color}
                         label='backgroundColor'
                         defaultColor={this.color.styles.selectSearch.menu.backgroundColor} />
            <ColorPicker callback={(color) => this.color.styles.selectSearch.menu.color = color}
                         label='color'
                         defaultColor={this.color.styles.selectSearch.menu.color} />

            <p className='text--center m-0 mt-2'
               style={{fontSize: '20px', fontWeight: 100, color: 'cadetblue'}}>
              Themes
            </p>

            <div className='container'>
              <hr style={{
                height: '2px',
                backgroundColor: '#098',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 -3px 10px 2px',
              }} />
            </div>

            <ColorPicker callback={(color) => this.color.styles.selectSearch.themes.primary = color}
                         label='primary'
                         defaultColor={this.color.styles.selectSearch.themes.primary} />
            <ColorPicker callback={(color) => this.color.styles.selectSearch.themes.primary25 = color}
                         label='primary25'
                         defaultColor={this.color.styles.selectSearch.themes.primary25} />
            <ColorPicker callback={(color) => this.color.styles.selectSearch.themes.primary50 = color}
                         label='primary50'
                         defaultColor={this.color.styles.selectSearch.themes.primary50} />
          </div>
        </div>
      </div>
    );
  }
}

export default SelectSearchTab;