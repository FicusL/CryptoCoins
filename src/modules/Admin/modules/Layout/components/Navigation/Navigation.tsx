import * as React from 'react';
import { Icon, Menu } from 'antd';
import { observer } from 'mobx-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import LogoSVG from './assets/logo.svg';

const SubMenu = Menu.SubMenu;

@observer
class Navigation extends React.Component<any & RouteComponentProps> {
  readonly basePath = '/admin/';

  constructor(props) {
    super(props);
  }

  makeMenu(menu, top = true, path: string = '') {
    return menu.map(item => {
      if (item.child) {

        const topPath = top ? item.key + '/' : path + item.key + '/';

        return (
          <SubMenu key={item.key} title={
            <span>
              {item.icon ? <Icon type={item.icon}/> : ''}
              <span className={top ? 'coll-nav-text' : ''}>{item.name}</span>
            </span>}>
            {this.makeMenu(item.child, false, topPath)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={path + item.key}>
            <Link to={this.basePath + path + item.key}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              <span className={top ? 'coll-nav-text' : ''}>{item.name}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  render() {
    const menu = this.makeMenu(this.props.menuItems);
    const { pathname } = this.props.location;

    return (
      <div>
        <div className='logo'>
          <img alt='logo' src={LogoSVG}/>
          <span>Dashboard</span>
        </div>
        <Menu theme='dark' mode={this.props.isCollapsed ? 'vertical' : 'inline'} selectedKeys={[pathname]}>
          {menu}
        </Menu>
      </div>
    );
  }
}
export default withRouter(Navigation) as React.ComponentClass<any>;