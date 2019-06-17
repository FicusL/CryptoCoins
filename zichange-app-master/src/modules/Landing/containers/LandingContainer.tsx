import './style.scss';
import * as React from 'react';
import Header from '../components/Header/Header';
import ZichangeInfo from '../components/ZichangeInfo/ZichangeInfo';
import WhyTradeWithUs from '../components/WhyTradeWithUs/WhyTradeWithUs';
import Footer from '../components/Footer/Footer';
import HowItWorks from '../components/HowItWorks';
import { lazyInject } from '../../IoC';
import { LocaleStore } from '../../Shared/stores/LocaleStore';
import { RouteComponentProps, withRouter } from 'react-router';

interface IProps {
  path: string;
}

class LandingContainer extends React.Component<RouteComponentProps> {

  @lazyInject(LocaleStore)
  locale: LocaleStore;

  componentWillMount(): void {
    if (this.props.history.location.pathname === '/ru') {
      this.locale.switchTo('ru');
    }
  }

  render() {
    return (
      <div className='landing'>
        <Header />
        <ZichangeInfo />
        <HowItWorks />
        <WhyTradeWithUs />
        <Footer />
      </div>
    );
  }
}

export default withRouter(LandingContainer);