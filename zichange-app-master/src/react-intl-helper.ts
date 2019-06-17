import { FormattedMessage as FormattedMessageIntl, FormattedHTMLMessage as FormattedHTMLMessageIntl,
  injectIntl as injectIntlIntl, IntlProvider as IntlProverIntl } from 'react-intl';
import { observer } from 'mobx-react';

export const FormattedMessage = observer(FormattedMessageIntl);
export const FormattedHTMLMessage = observer(FormattedHTMLMessageIntl);
export const IntlProvider = observer(IntlProverIntl);
export const injectIntl = (component) => observer(injectIntlIntl(component));