import * as React from 'react';
import { RGBA } from '../../../../../../Shared/types/IRGBA';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';

@observer
class PreviewBody extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {
    return(
      <div style={{
        backgroundColor: RGBA.toRGBAString(this.color.styles.body.backgroundColor),
        width: '100%',
        height: '100%',
        padding: '25px',
        border: '#000 1px solid',
      }}>
        <p style={{color: RGBA.toRGBAString(this.color.styles.body.color), fontSize: '20px', margin: '0' }}>
          Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например,
          юмористические вставки или слова, которые даже отдалённо не напоминают латынь. Если вам нужен Lorem Ipsum для
          серьёзного проекта, вы наверняка не хотите какой-нибудь шутки, скрытой в середине абзаца.
        </p>
      </div>
    );
  }
}

export default PreviewBody;