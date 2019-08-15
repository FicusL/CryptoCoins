import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import ImageFile from 'react-dropzone';
import { FieldsStore } from '../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import { RGBA } from '../../types/IRGBA';
import { FormattedMessage } from '../../../../react-intl-helper';

export interface IFileInputChangeProps {
  name: string;
  value: ImageFile;
}

interface IState {
  fileName: string;
  errorMessage: null | string;
}

interface IProps {
  name: string;
  label?: string;
  className?: string;
  placeholder?: string;
  errorMessage?: string;
  sumsubErrorMessage?: string;
  value?: ImageFile;
  maxSize: number;
  onChange: (changeProps: IFileInputChangeProps) => void;
  onReject?: () => void;
  colors?: FieldsStore;
  disabled?: boolean;
}

export default class FileInput extends Component<IProps, IState> {
  state = {fileName: '', errorMessage: null};

  constructor(props) {
    super(props);
    this.state.fileName = _.get(props, 'value.name');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errorMessage: nextProps.errorMessage });
  }

  onDropAccepted = files => {
    this.setState({fileName: files[0].name, errorMessage: null});
    _.invoke(this.props, 'onChange', {name: this.props.name, value: files[0]});
  };

  onDropRejected = files => {
    let errorMessage;
    if (files[0].size > this.props.maxSize) {
      errorMessage = 'File too large';
    }
    else {
      errorMessage = 'Incorrect file type';
    }

    this.setState({ fileName: '', errorMessage });

    if (this.props.onReject) {
      this.props.onReject();
    }
  };

  render() {
    const {label, className, placeholder, colors, disabled, sumsubErrorMessage} = this.props;
    const {errorMessage, fileName} = this.state;
    const cn = classNames('form__field', {'form__show-error': !!errorMessage || !!sumsubErrorMessage}, className);

    return (
      <div className={cn}>
        <label className='form__label'>{label}</label>
        {!!sumsubErrorMessage &&
          <div className='form__show-error'>
            <span className='form__sumsub-error-message'>
              <FormattedMessage id='dashboard.kyc.sumsubError' />
            </span>
            <span className='form__sumsub-error-message mb-2'>{sumsubErrorMessage}</span>
          </div>
        }

        <Dropzone
          accept='application/pdf,image/png,image/jpg,image/jpeg'
          className='form__input form__input-file'
          multiple={false}
          maxSize={this.props.maxSize}
          onDropAccepted={this.onDropAccepted}
          onDropRejected={this.onDropRejected}
          disabled={disabled}
        >
          <span style={colors ? {color: RGBA.toRGBAString(colors.color)} : {}}
                className={classNames({'placeholder': !fileName}, 'header_description')}>
            {fileName || placeholder}
          </span>
          <span style={{textDecoration: 'underline'}}>
            <FormattedMessage id='dashboard.kyc.tier1.documents.chooseFile' />
          </span>
        </Dropzone>
        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}
