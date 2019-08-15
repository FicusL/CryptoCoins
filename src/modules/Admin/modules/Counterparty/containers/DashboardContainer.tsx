import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, message, Tabs } from 'antd';
import { lazyInject } from '../../../../IoC';
import { ColorStore, REQUEST_FETCH_STYLE_TASK } from '../stores/Colors/ColorStore';
import './style.scss';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import BackgroundTab from '../components/Tabs/BackgroundTab';
import HeaderTab from '../components/Tabs/HeaderTab';
import ButtonsTab from '../components/Tabs/ButtonsTab';
import InputsTab from '../components/Tabs/InputsTab';
import SelectSearchTab from '../components/Tabs/SelectSearchTab';
import RadioButtonTab from '../components/Tabs/RadioButtonTab';
import ProgressBarTab from '../components/Tabs/ProgressBarTab';
import CheckboxTab from '../components/Tabs/CheckboxTab';

@observer
class DashboardContainer extends React.Component {

  @lazyInject(ColorStore)
  store: ColorStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  componentWillMount(): void {
    this.store.getStyles();
  }

  onClickSave = () => {
    this.store.addStyles(this.store.styles)
      .then(() => message.success('Styles successful added'));
  };

  render() {

    if (this.loaderStore.hasTask(REQUEST_FETCH_STYLE_TASK)) {
      return null;
    }

    return(
      <div className='container'>
        <Tabs defaultActiveKey='1' onChange={() => {}} style={{border: '1px solid #e8e8e8', minHeight: '700px'}}>
          <Tabs.TabPane tab='Background' key='1'>
            <BackgroundTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Header' key='2'>
            <HeaderTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Buttons' key='3'>
            <ButtonsTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Inputs' key='4'>
            <InputsTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Select' key='5'>
            <SelectSearchTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Radio Button' key='6'>
            <RadioButtonTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Checkbox' key='7'>
            <CheckboxTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Progress Bar' key='8'>
            <ProgressBarTab />
          </Tabs.TabPane>
        </Tabs>
        <div className='d-flex justify-content-center mt-3'>
          <Button htmlType='button' type='primary' style={{minWidth: '120px'}} onClick={this.onClickSave}>
            Save
          </Button>
        </div>
      </div>

    );
  }
}

export default DashboardContainer;