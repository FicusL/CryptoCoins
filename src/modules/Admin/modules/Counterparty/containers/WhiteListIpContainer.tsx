import * as React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Button, Input, message, Modal, Popconfirm, Switch, Table } from 'antd';
import { WhiteListIpModel } from '../model/WhiteListIpModel';
import { lazyInject } from '../../../../IoC';
import { WhiteListIpStore } from '../stores/WhiteListIpStore';
import { ChangeEvent } from 'react';
import { observable } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';

@observer
class WhiteListIpContainer extends React.Component<RouteComponentProps> {

  @lazyInject(WhiteListIpStore)
  store: WhiteListIpStore;

  @observable ipAddress: string = '';
  @observable isVisible: boolean = false;

  columns: Array<ColumnProps<WhiteListIpModel>> = [
    {
      title: 'IP',
      dataIndex: 'ipAddress',
    },
    {
      title: 'Action',
      render: (text, record) => (
          this.store.whiteList.length >= 1
              ? (
                  <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.ipAddress)}>
                    <a href='javascript:'>Delete</a>
                  </Popconfirm>
              ) : null
      ),
    },
  ];

  componentWillMount(): void {
    this.store.getWhiteListIpAddresses()
        .then(() => message.success('White list successful loaded'));
  }

  onChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    this.ipAddress = e.target.value;
  };

  onClickOk = () => {
    this.store.addIpAddress(this.ipAddress).then(() => {
      this.isVisible = false;
    });
  };

  onClickCancel = () => {
    this.isVisible = false;
  };

  handleAdd = () => {
    if (this.ipAddress) {
      this.ipAddress = '';
    }
    this.isVisible = true;
  };

  handleDelete = (ipAddress: string) => {
    this.store.deleteIpAddress(ipAddress)
        .then(() => message.success('IP address successful deleted'))
        .catch(() => message.error('Internal server error'));
  };

  handleSwitch = () => {
    if (this.store.useWhiteListIPs) {
      this.store.onWhiteList().then(() => message.success('Switched on'));
    } else {
      this.store.offWhiteList().then(() => message.success('Switched off'));
    }

    this.store.useWhiteListIPs = !this.store.useWhiteListIPs;
  };
  
  render() {
    return(
      <>
        <Modal title='Add new IP address' onOk={this.onClickOk} onCancel={this.onClickCancel} visible={this.isVisible}>
          <Input placeholder='Enter the IP address..'
                 value={this.ipAddress}
                 onChange={this.onChangeLabel}
                 className='mt-2 mb-2'
          />
        </Modal>
        <Button
            htmlType='button'
            onClick={this.handleAdd}
            type='primary'
            className='mr-3 mb-3'
        >
          Add new IP address
        </Button>
        <Switch defaultChecked onChange={this.handleSwitch} />,
        <Table<WhiteListIpModel>
            columns={this.columns}
            dataSource={this.store.whiteList}
            bordered
        />
      </>
    );
  }
}

export default WhiteListIpContainer;