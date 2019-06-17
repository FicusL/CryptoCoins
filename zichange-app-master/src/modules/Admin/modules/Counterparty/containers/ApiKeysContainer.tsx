import * as React from 'react';
import { Button, Input, message, Modal, Popconfirm, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { lazyInject } from '../../../../IoC';
import { ApiKeysModel } from '../model/ApiKeysModel';
import { RouteComponentProps, withRouter } from 'react-router';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ChangeEvent } from 'react';
import { ADD_API_KEYS, ApiKeysStore, FETCH_API_KEYS, REMOVE_API_KEYS } from '../stores/ApiKeysStore';
import CopyToClipboard from 'react-copy-to-clipboard';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

@observer
class ApiKeysContainer extends React.Component<RouteComponentProps> {

  @lazyInject(ApiKeysStore)
  store: ApiKeysStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  @observable label: string = '';
  @observable isVisible: boolean = false;

  columns: Array<ColumnProps<ApiKeysModel>> = [
    {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Label',
      dataIndex: 'label',
    },
    {
      title: 'Public Key',
      dataIndex: 'firstSymbolsOfPublicKey',
    },
    {
      title: 'Action',
      render: (text, record) => (
        this.store.keys.length >= 1
          ? (
            <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.id)}>
              <a href='javascript:'>Delete</a>
            </Popconfirm>
          ) : null
      ),
    },
  ];

  componentWillMount(): void {
    this.store.getApiKeys()
      .then(() => message.success('API Keys successful loaded'));
  }

  onChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    this.label = e.target.value;
  };

  onClickOk = () => {
    this.store.addApiKey(this.label).then(() => {
      this.isVisible = false;

      Modal.info({
        title: 'API Keys',
        content: (
          <div className='container mt-3 mb-3'>
            <div className='d-flex row align-items-center justify-content-between mt-2 mb-2'>
              <p className='p-0 m-0 mr-3'>Public key: {this.store.publicKey}</p>
              <CopyToClipboard text={this.store.publicKey}>
                <Button htmlType='button'
                        icon='copy'
                        onClick={() => message.success('Public key saved')}
                />
              </CopyToClipboard>
            </div>

            <div className='d-flex row align-items-center justify-content-between mt-2 mb-2'>
              <p className='p-0 m-0 mr-3'>Secret key: {this.store.secretKey}</p>
              <CopyToClipboard text={this.store.secretKey}>
                <Button htmlType='button'
                        icon='copy'
                        onClick={() => message.success('Secret key saved')}
                />
              </CopyToClipboard>
            </div>

          </div>
        ),
        style: {minWidth: '700px' },
      });

      this.store.reset();
    });
  };

  onClickCancel = () => {
    this.isVisible = false;
  };

  handleAdd = () => {
    if (this.label) {
      this.label = '';
    }
    this.isVisible = true;
  };

  handleDelete = (key: number) => {
    this.store.deleteApiKey(key)
      .then(() => message.success('API Key successful deleted'))
      .catch(() => message.error('Internal server error'));
  };

  render() {

    if (this.loaderStore.hasTask(FETCH_API_KEYS) ||
        this.loaderStore.hasTask(ADD_API_KEYS) ||
        this.loaderStore.hasTask(REMOVE_API_KEYS)) {
      return null;
    }

    return(
      <>
        <Modal title='Add new key' onOk={this.onClickOk} onCancel={this.onClickCancel} visible={this.isVisible}>
          <Input placeholder='Enter the label..'
                 value={this.label}
                 onChange={this.onChangeLabel}
                 className='mt-2 mb-2'
          />
        </Modal>
        <Button
          htmlType='button'
          onClick={this.handleAdd}
          type='primary'
          className='mb-3'
        >
          Add new key
        </Button>

        <Table<ApiKeysModel>
          columns={this.columns}
          dataSource={this.store.keys}
          bordered
        />
      </>
    );
  }
}

export default withRouter(ApiKeysContainer);