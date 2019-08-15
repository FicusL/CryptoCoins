import * as React from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';

ReactModal.setAppElement('#root');

interface IProps {
  className?: string;
  isOpen: boolean;
  onRequestClose?: () => void;
  shouldCloseOnOverlayClick?: boolean;
  hideCloseIcon?: boolean;
  disableOverlay?: boolean;
  style?: ReactModal.Styles;
}

class ModalBase extends React.Component<IProps> {
  public static Title = ({children}) => (
    <h2 className='modal__title'>{children}</h2>
  );

  public render() {
    const { className, isOpen, onRequestClose, disableOverlay, shouldCloseOnOverlayClick, hideCloseIcon, children, style } =
      this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        className={classNames('modal', className)}
        overlayClassName={classNames('modal__overlay', {'modal__overlay-disabled': disableOverlay})}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        style={style}
      >
        { !hideCloseIcon && <i className='modal__close-icon' onClick={onRequestClose}/> }
        {children}
      </ReactModal>
    );
  }
}

export default ModalBase;
