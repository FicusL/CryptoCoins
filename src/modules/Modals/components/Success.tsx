import * as React from 'react';
import ModalBase from './ModalBase';
import Button from '../../Shared/components/Buttons/Button';


interface IProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

export default class ModalSuccess extends React.Component<IProps> {

  public render() {
    const { title, description, onClose } = this.props;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>{title}</ModalBase.Title>

        <p className='modal-note'>
          {description}
        </p>

        <i className='icon icon-checkmark mx-auto mb-4' />

        <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>OK</Button>
      </ModalBase>
    );
  }
}