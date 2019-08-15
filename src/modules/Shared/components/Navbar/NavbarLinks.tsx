import * as React from 'react';
import { NavLink } from 'react-router-dom';

export interface INavbarLinkLocation {
  path: string;
  title: string;
  exact: boolean;
}

export interface INavbarLinksProps {
  links: INavbarLinkLocation[];
  onLinkClick: () => void;
}

export class NavbarLinks extends React.Component<INavbarLinksProps> {
  render() {
    return (
      <nav className='nav-bar__menu'>
        <ul>
          {this.props.links.map(({path, title, exact}, i) => (
            <NavLink to={path} onClick={this.props.onLinkClick} activeClassName={'active'} exact={exact} key={i}>
              <li className='nav-bar__menu-item'>
                  {title}
              </li>
            </NavLink>
          ))}
        </ul>
      </nav>
    );
  }
}