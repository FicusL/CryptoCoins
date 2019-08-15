import * as React from 'react';
import './style.scss';
import CartSVG from '../assets/shopping-cart.svg';
import PointerSVG from '../assets/pointer.svg';
import LandingButton from '../../LandingButton/LandingButton';
import ReactSVG from 'react-svg';

interface IProps {
  onClick?: () => void;
}

class OrderButton extends React.Component<IProps> {
  render() {
    return (
      <LandingButton className='order-button' onClick={this.props.onClick}>
        {this.props.children}
        <ReactSVG src={CartSVG} />
        <ReactSVG src={PointerSVG} className='pointer-svg'/>
      </LandingButton>
    );
  }
}

export default OrderButton;
