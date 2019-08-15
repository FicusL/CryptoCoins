import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import './style.scss';
import { observer } from 'mobx-react';

interface IProps {
  id: string;
}

const toParagraphs = (...nodes) => {
  let key = 0;
  const children = nodes.reduce((result, node) => (
    result.concat(
      typeof node === 'string'
        ? node
          .split('\n')
          .map(paragraph => <span key={++key}>{paragraph}</span>)
        : node,
    )
  ), []);

  return <span className='text_formatted'>{children}</span>;
};

@observer
class TextFormat extends React.Component<InjectedIntlProps & IProps> {
  render() {
    const messages = {
      text: {
        id: this.props.id,
      },
    };

    return(
      <FormattedMessage {...messages.text}>
        {toParagraphs}
      </FormattedMessage>
    );
  }
}

export default injectIntl(TextFormat);
