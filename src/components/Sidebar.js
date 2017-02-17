import React, { PropTypes } from 'react';
import {Link} from 'react-router';

class Sidebar extends React.Component {
  constructor(){
    super();
  }
  render () {
    let userView = <Link to='/signin' className='pink-text' style={{'textDecoration' : 'none'}}><h3>Sign in</h3></Link>;
    let signout = null;
    if(this.props.isSignedIn){
      userView = <h3 className='black-text'><i className="medium material-icons">perm_identity</i>{this.props.currentUserNickname}</h3>;
      signout = <a className='text-right pink-text' onClick={this.props.handleSignout} style = {{'textDecoration' : 'none', 'cursor':'pointer'}}>sign out</a>;
    }
    return(
      <ul id='slide-out' className="side-nav fixed grey darken-3">
        <li><div className="userView white-text">
          <Link className='white-text'
                style = {{'textDecoration' : 'none', 'cursor':'pointer'}}
                to='/'><h2>Taehee Lee</h2>
          </Link>
        </div></li>
        <li><div className="userView">
          {userView}
          {signout}
        </div></li>
      <div className="divider"></div>
        <li className="no-padding">
        <ul className="collapsible collapsible-accordion ">
          <li>
            <a className="collapsible-header white-text" style = {{'textDecoration' : 'none'}}>
              Dropdown
              <i className="material-icons">arrow_drop_down</i>
            </a>
            <div className="collapsible-body">
              <ul className="pink-text">
                <li><a href="#!">First</a></li>
                <li><a href="#!">Second</a></li>
                <li><a href="#!">Third</a></li>
                <li><a href="#!">Fourth</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </li>
      <li><Link to='/' className = 'white-text' style = {{'textDecoration' : 'none'}}>Home</Link></li>
      <li><Link to='/notice' className = 'white-text' style = {{'textDecoration' : 'none'}}>Notice</Link></li>
    </ul>
    );
  }
}
Sidebar.propTypes = {
  isSignedIn : PropTypes.bool.isRequired,
  currentUserNickname : PropTypes.string.isRequired,
  handleSignout : PropTypes.func.isRequired,
};
export default Sidebar;
