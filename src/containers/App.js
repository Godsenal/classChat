import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import { getStatusRequest, signoutRequest} from '../actions/authentication';

import {Sidebar} from '../components';


class App extends Component{
  constructor(){
    super();

    this.handleSignout = this.handleSignout.bind(this);
  }
  getCookie(name){
    var value = '; '+ document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }
  componentDidMount() {
        // get login data from cookie
    let signinData = this.getCookie('key');

        // if loginData is undefined, do nothing
    if(typeof signinData === 'undefined') return;

        // decode base64 & parse json
    signinData = JSON.parse(atob(signinData));

        // if not logged in, do nothing
    if(!signinData.isSignedIn) return;

        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
      () => {
        if(!this.props.status.valid) {
                    // if session is not valid
                    // logout the session
          signinData = {
            isSignedIn: false,
            id: '',
            nickname: '',
          };

          document.cookie = 'key=' + btoa(JSON.stringify(signinData));

          Materialize.toast('Your session is expired, please sign in again', 4000);
        }
      }
    );

  }
  handleSignout(){
    this.props.signoutRequest().then(
      () => {
        Materialize.toast('Good Bye!', 2000);
        let signinData = {
          isSignedIn: false,
          id: '',
          nickname: '',
        };
        document.cookie = 'key=' + btoa(JSON.stringify(signinData));
      }
    );
  }
  render(){
    let re = /(signin|signup)/;
    let isAuth = re.test(this.props.location.pathname); // test current location is whether signin or signup
    let sidebar = null;
    if(!isAuth){
      sidebar = <div className="col s3">
                  <Sidebar isSignedIn={this.props.status.isSignedIn}
                           currentUserNickname={this.props.status.currentUserNickname}
                           handleSignout={this.handleSignout}  />
                </div>;
    }
    return(
      <div className='container'>
        <div className="row">
          {sidebar}
          <div className="col s9">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

}

App.propTypes = {
  getStatusRequest : PropTypes.func.isRequired,
  signoutRequest : PropTypes.func.isRequired,
  status : PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    status: state.authentication.status,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
    signoutRequest: () => {
      return dispatch(signoutRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
