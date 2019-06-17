import React from 'react';
import Button from '../Buttons/Button';
import ModalBase from '../../../Modals/components/ModalBase';

interface IProps {
  title: string;
  description?: string;
  icon?: 'checkmark' | 'security' | 'simple' | 'compliant' | 'kyc-sent';
  isOpen?: boolean;
  onClose?: () => void;
}

export default class Modal extends React.Component<IProps> {
  public static Success = ({ title, description, onClose } : IProps) =>
    <Modal title={title} description={description} icon='checkmark' onClose={onClose} />;

  public static Error = ({title, description, onClose} : IProps) =>
    <Modal title={title} description={description} onClose={onClose}/>;

  public static Info = ({title, description, icon, onClose} : IProps) =>
    <Modal title={title} description={description} icon={icon} onClose={onClose} />;


  render() {
    const { title, description, icon, onClose } = this.props;
    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>{title}</ModalBase.Title>

        {description ? <p className='modal-note'>{description}</p> : null}
        {icon ? <i className={`icon icon-${icon} mx-auto mb-4`} /> : null}

        <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>OK</Button>
      </ModalBase>
    );
  }
}