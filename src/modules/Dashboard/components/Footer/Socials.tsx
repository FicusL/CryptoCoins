import * as React from 'react';
import EnvelopeSVG from './icons/envelope.svg';
import FacebookSVG from './icons/facebook.svg';
import TelegramSVG from './icons/telegram.svg';
import TwitterSVG from './icons/twitter.svg';
import ReactSVG from 'react-svg';


class Socials extends React.Component {

  render() {
    return (
      <div className='footer__socials'>
        <a className='social-link' href='mailto:info@zichain.io'>
          <ReactSVG src={EnvelopeSVG} svgClassName='social-svg' />
        </a>
        <a className='social-link'
           href='https://www.facebook.com/zichainecosystem/'
           target='_blank' rel='noopener noreferrer'
        >
          <ReactSVG src={FacebookSVG} svgClassName='social-svg' />
        </a>
        <a className='social-link'
           href='https://t.me/Zichain_EN'
           target='_blank' rel='noopener noreferrer'
        >
          <ReactSVG src={TelegramSVG} svgClassName='social-svg' />
        </a>
        <a className='social-link'
           href='https://twitter.com/Zichain1/'
           target='_blank' rel='noopener noreferrer'
        >
          <ReactSVG src={TwitterSVG} svgClassName='social-svg' />
        </a>
      </div>
    );
  }
}

export default Socials;