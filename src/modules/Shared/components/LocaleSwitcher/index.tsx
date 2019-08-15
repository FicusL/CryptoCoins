import flagen from '../../assets/images/en-flag.png';
import flagru from '../../assets/images/ru-flag.png';
import * as React from 'react';
import './style.scss';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../IoC';
import { LocaleStore } from '../../stores/LocaleStore';
import { ColorStore } from '../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { RGBA } from '../../types/IRGBA';
import { RouteComponentProps, withRouter } from 'react-router';

interface ILangState {
  activeIndex: number;
}

@observer
class LocaleSwitcher extends React.Component<RouteComponentProps, ILangState> {
  @lazyInject(LocaleStore)
  private readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  constructor(props) {
    super(props);

    let index = this.languageList.findIndex(item => item.value === this.localeStore.locale);
    if (index === -1) {
      index = 0;
    }

    this.state = {
      activeIndex: index,
    };
  }

  private languageList = [
    {shortcut: 'EN', flag: flagen, value: 'en'},
    {shortcut: 'RU', flag: flagru, value: 'ru'},
  ];

  private changeLanguage = (e) => {
    e.preventDefault();

    const {activeIndex} = this.state;
    const next = activeIndex === this.languageList.length - 1 ? 0 : activeIndex + 1;
    this.localeStore.switchTo(this.languageList[next].value as any);
    this.setState({activeIndex: next });

    if (this.props.history.location.pathname === '/' || this.props.history.location.pathname === '/ru') {
      if (next === 1) {
        this.props.history.push('/ru');
      } else {
        this.props.history.push('/');
      }
    }
  };

  public render() {
    const { activeIndex } = this.state;

    return(
      <div className='lang-switcher' onClick={this.changeLanguage}>
          <img src={this.languageList[activeIndex].flag} alt='flag'/>
          <span className='lang-id' style={this.colorStore.isLoaded ?
              {color: RGBA.toRGBAString(this.colorStore.styles.header.color)} :
              {}}>
            {this.languageList[activeIndex].shortcut}
          </span>
      </div>
    );
  }
}

export default withRouter(LocaleSwitcher);