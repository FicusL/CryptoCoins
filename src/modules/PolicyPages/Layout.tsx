import * as React from 'react';
import './style.scss';
import Footer from '../Landing/components/Footer/Footer';
import Navbar from '../Landing/components/Header/Navbar';

class Layout extends React.Component {

  render() {
    return (
      <section className='landing'>
        <Navbar />
        <div style={{ height: '75px' }} />
        <div className='container policy-page'>
          {this.props.children}
        </div>
        <Footer/>
      </section>
    );
  }
}

export default Layout;