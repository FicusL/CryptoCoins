import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface IProps {
  tabs: Array<[string, any]>;
  initialActiveTab?: number;
}

interface IState {
  activeTabIndex: number;
}

class Tabs extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      activeTabIndex: props.initialActiveTab || 0,
    };
  }

  render() {
    const { tabs } = this.props;
    const { activeTabIndex } = this.state;
    const TabContent = tabs[activeTabIndex][1];

    return (
      <div className='tabs'>
        <ul className='tabs__list'>
        {tabs.map(([name], i) => (
          <li className={cn('tab', { 'active': i === activeTabIndex })}
              key={i}
              onClick={() => this.setState({ activeTabIndex: i })}
          >{name}</li>
        ))}
        </ul>
        <div className='tab-content'>
          {typeof TabContent === 'string' ? TabContent : <TabContent />}
        </div>
      </div>
    );
  }
}

export default Tabs;
