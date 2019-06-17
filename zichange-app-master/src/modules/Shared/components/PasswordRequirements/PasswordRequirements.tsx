import './style.scss';
import * as React from 'react';
import cn from 'classnames';

import { FormattedMessage } from 'react-intl';

export default class PasswordRequirements extends React.Component<{password}> {
  render() {
    const { password } = this.props;

    const lengthValid = password.length >= 8;
    const hasLowercase = /[a-z]/g.test(password);
    const hasUppercase = /[A-Z]/g.test(password);
    const hasNumbers = /\d/g.test(password);
    const hasSpecialChar = /[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]/g.test(password);

    return (
      <div className='no-gutters pass-requirements__container'>
        <div className='row'>
          <ul className='pass-requirements'>
            <li className={cn('requirement', {'requirement--completed': hasLowercase})}>
              <FormattedMessage id='authorization.lowercaseAlert' defaultMessage='Lowercase characters' />
            </li>

            <li className={cn('requirement', {'requirement--completed': hasUppercase})}>
              <FormattedMessage id='authorization.uppercaseAlert' defaultMessage='Uppercase characters' />
            </li>

            <li className={cn('requirement', {'requirement--completed': hasNumbers})}>
              <FormattedMessage id='authorization.numbersAlert' defaultMessage='Numbers' />
            </li>

            <li className={cn('requirement', {'requirement--completed': hasSpecialChar})}>
              <FormattedMessage id='authorization.specialAlert' defaultMessage='Special characters' />
            </li>

            <li className={cn('requirement', {'requirement--completed': lengthValid})}>
              <FormattedMessage id='authorization.minimumAlert' defaultMessage='8 characters minimum' />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}