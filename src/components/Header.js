import React, { PropTypes } from 'react'
import {Link} from 'react-router';
import {Navbar, NavItem} from 'react-materialize';
class Header extends React.Component {


  render () {
    return(
      <nav>
        <div className="nav-wrapper">
          <Link to = "/" className="brand-logo">Taehee Lee</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><Link to="/notice" >notice</Link></li>
            </ul>
        </div>
    </nav>
    );
  }
}

export default Header;
