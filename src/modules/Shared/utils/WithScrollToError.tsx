import * as React from 'react';
import * as Scroll from 'react-scroll';

export interface IScrollToErrorProps {
  scrollToError: () => void;
}

export default function withScrollToError(WrappedComponent) {
  return class extends React.Component {
    scrollToError = () => {
      const errorElement = document.querySelector('.form__show-error');
      const bodyRect = document.body.getBoundingClientRect();
      const errorElementRect = errorElement && errorElement.getBoundingClientRect();
      const offset = errorElementRect && (errorElementRect.top - bodyRect.top - 60);

      Scroll.animateScroll.scrollTo(offset);
    };

    render() {
      return (
        <WrappedComponent {...this.props} scrollToError={this.scrollToError}  />
      );
    }
  };
}