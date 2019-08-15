import * as React from 'react';
import HowItWorksDesktop from './HowItWorksDesktop';
import HowItWorksMobile from './HowItWorksMobile';


class HowItWorks extends React.Component {

  render() {
    return (
      <React.Fragment>
        <HowItWorksDesktop />
        <HowItWorksMobile />
      </React.Fragment>
    );
  }
}

export default HowItWorks;