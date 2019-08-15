import * as React from 'react';
import Button from '../Buttons/Button';
import ModalBase from './ModalBase';


interface IProps {
  title: string;
  isOpen: boolean;
  description?: string;
  onClose?: () => void;
}

export default class ModalSuccess extends React.Component<IProps> {

  public render() {
    const { title, description, isOpen, onClose } = this.props;

    return (
      <ModalBase isOpen={isOpen} onRequestClose={onClose}>
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