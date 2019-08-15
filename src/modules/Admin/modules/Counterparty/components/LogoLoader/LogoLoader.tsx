import * as React from 'react';
import { Icon, Upload, message, Modal } from 'antd';
import { lazyInject } from '../../../../../IoC';
import { UploadStore } from '../../stores/UploadStore';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadChangeParam } from 'antd/es/upload';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { SessionStore } from '../../../../../Shared/stores/SessionStore';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

interface IState {
  previewVisible: boolean;
  previewImage: string;
  src: string;
}

@observer
class LogoLoader extends React.Component<{}, IState> {

  @lazyInject(AxiosWrapper)
  axios: AxiosWrapper;

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  @lazyInject(UploadStore)
  uploadStore: UploadStore;

  @observable previewVisible: boolean = false;
  @observable previewImage: string = '';

  handleCancel = () => this.previewVisible = false;

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
    this.uploadStore.file = this.previewImage;
  };

  handleChange = ({ file } : UploadChangeParam) => {
    getBase64(file.originFileObj, img => {
      this.uploadStore.file = img;
    });
    // this.uploadStore.file = file.url || file.thumbUrl;

    if (file.status === 'removed') {
      this.uploadStore.file = '';
    }
  };

  customRequest = async (options: any) => {
      const data = new FormData();
      data.append('logo', options.file);

      await this.axios.post(options.action, data).then((res: any) => {
        options.onSuccess(res.data, options.file);
        // this.uploadStore.file = options.file.url || options.file.thumbUrl;
      }).catch((err: Error) => {
        message.error(err.message);
      });
  };

  render() {

    const uploadButton = (
        <div>
          <Icon type='plus' />
          <div className='ant-upload-text'>Upload</div>
        </div>
    );

    console.log('FILE: ', this.uploadStore.file);

    return(
      <>
        <Upload
          listType='picture-card'
          showUploadList={true}
          accept='image/*'
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          action='/counterparties/logo'
          customRequest={this.customRequest}
        >
          {!this.uploadStore.file && uploadButton}
        </Upload>
        <Modal align={{}} visible={this.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={this.previewImage} />
        </Modal>
      </>
    );
  }
}

export default LogoLoader;