import React, { PropTypes } from 'react';
import {Link} from 'react-router';

class Header extends React.Component {
  constructor(){
    super();
  }
  render () {
    let headerRight = null;
    if(this.props.isSignedIn){
      headerRight = <div className="right-align">
                      <span className="right-align">{this.props.currentUser}</span>
                      <a className="right-align" style = {{'textDecoration' : 'none'}} onClick={this.props.handleSignout}>Sign out</a>
                    </div>;
    }else {
      headerRight = <Link to="/signin" style = {{'textDecoration' : 'none'}} className = 'right'><span>Sign in</span></Link>;
    }
    return(
      <nav>
        <div className="nav-wrapper blue-grey lighten-2 ">
          <Link to="/" className="brand-logo center white-text text-darken-2" style = {{'textDecoration' : 'none'}}>Taehee Lee</Link>
          {headerRight}
        </div>
      </nav>
    );
  }
}

export default Header;
