import * as React from 'react';
import Modal from '../../../../../Modals/components/ModalBase';

interface IProps {
  onClose?: () => void;
}

class WalletsNotFoundModal extends React.Component<IProps> {
  render() {
    return(
        <Modal onRequestClose={this.props.onClose}>
          <Modal.Title>
            Wallets don't create yet
          </Modal.Title>
          <div className='container'>
            <p>
              Wait before your wallet will be generation
            </p>
          </div>
        </Modal>
    );
  }
}

export default WalletsNotFoundModal;