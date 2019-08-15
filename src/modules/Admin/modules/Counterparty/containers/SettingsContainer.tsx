import * as React from 'react';
import { Button, Input, message } from 'antd';
import { lazyInject } from '../../../../IoC';
import { SettingsStore } from '../stores/SettingsStore';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class SettingsContainer extends React.Component {

  @lazyInject(SettingsStore)
  store: SettingsStore;

  @observable url: string = '';
  @observable letterTextFooter: string = '';

  urlHandler = (e) => {
    this.url = e.target.value;
  };

  letterTextFooterHandler = (e) => {
    this.letterTextFooter = e.target.value;
  };

  urlSaveButton = () => {
    this.store.setUrl(this.url).then(() => message.success('Url successful set'));
  };

  letterTextFooterSaveButton = () => {
    this.store.setTextLetter(this.letterTextFooter).then(() => message.success('Text successful set'));
  };

  render() {
    return(
      <div className='container'>
        <div className='d-flex justify-content-center align-items-center mb-3'>
          <p className='m-0 p-0 mr-3'>Url: </p>
          <Input onChange={this.urlHandler} value={this.url} placeholder='Enter the url' style={{width: '300px'}} className='mr-3' />
          <Button type='primary' htmlType='button' onClick={this.urlSaveButton}>
            Save
          </Button>
        </div>

        <div className='d-flex justify-content-center align-items-center'>
          <p className='m-0 p-0 mr-3'>Letter Text Footer: </p>
          <Input onChange={this.letterTextFooterHandler}
                 value={this.letterTextFooter}
                 placeholder='Enter the text' style={{width: '300px'}}
                 className='mr-3' />
          <Button type='primary' htmlType='button' onClick={this.letterTextFooterSaveButton}>
            Save
          </Button>
        </div>
      </div>
    );
  }
}

export default SettingsContainer;