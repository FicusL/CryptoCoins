import * as React from 'react';
import { Icon, Layout as AntdLayout } from 'antd';
const {Header, Sider, Content} = AntdLayout;
import { RouteComponentProps, withRouter } from 'react-router';

import './index.scss';
import Navigation from './components/Navigation/Navigation';

import { MenuItemsStore } from './stores/MenuItemsStore';
import { observer } from 'mobx-react';
import Bread from './components/Bread/Bread';
import { lazyInject } from '../../../IoC';
import { SessionStore } from '../../../Shared/stores/SessionStore';

interface IState {
  isCollapsed: boolean;
}

@observer
class Layout extends React.Component<RouteComponentProps, IState> {
  state: IState = {
    isCollapsed: false,
  };

  @lazyInject(MenuItemsStore)
  store: MenuItemsStore;

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  constructor(props) {
      super(props);
  }

  render() {

    const isCounterparty = this.sessionStore.isCounterparty;
    const isAmlOfficer = this.sessionStore.isAmlOfficer;

    return (
      <AntdLayout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.isCollapsed}
          className={this.state.isCollapsed ? 'collapsed' : this.sessionStore.isAdmin ? 'slider' : ''}
        >
          <Navigation isCollapsed={this.state.isCollapsed}
                      menuItems={isCounterparty ? this.store.counterpartyMenuItems :
                          isAmlOfficer ? this.store.amlMenuItems :
                          this.store.adminMenuItems} />
        </Sider>
        <AntdLayout>
          <Header style={{background: '#fff', padding: 0}}>
            <Icon
              className='trigger'
              type={this.state.isCollapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => this.setState({ isCollapsed: !this.state.isCollapsed })}
            />
          </Header>
          <Bread routes={this.props.location.pathname.split('/')}
                 menuItems={isCounterparty ?
                     this.store.counterpartyMenuItems
                     : isAmlOfficer ?
                         this.store.amlMenuItems :
                         this.store.adminMenuItems} />
          <Content >
            <div style={{padding: 24, minHeight: '80vh'}}>
              {this.props.children}
            </div>
          </Content>
        </AntdLayout>
      </AntdLayout>
    );
  }
}
export default withRouter(Layout) as React.ComponentClass<{}>;
