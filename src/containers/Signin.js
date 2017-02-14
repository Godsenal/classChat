import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { signinRequest } from '../actions/authentication';


class Signin extends Component{
  constructor() {
    super();
    this.state= {
      id:'',
      pw:'',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
  }
  handleChange(e){
    if(e.target.name === 'id')
      this.setState({id: e.target.value});
    else if(e.target.name ==='pw')
      this.setState({pw: e.target.value});
  }
  handleSignin(){
    let id = this.state.id;
    let pw = this.state.pw;

    this.props.signinRequest(id,pw)
      .then(() => {
        if(this.props.status === 'SUCCESS') {
          let signinData = {
            isSignedIn: true,
            id: id,
            nickname: this.props.nickname
          };
          document.cookie = 'key=' + btoa(JSON.stringify(signinData));
          Materialize.toast('Welcome ' + id + '!', 2000);
          browserHistory.push('/');
        }
        else{
          Materialize.toast('Incorrect username or password', 2000);
          this.setState({pw : ''});
        }
      });
  }
  render(){
    return(<div className = 'container'>
            <div className = 'row'>
              <div className="col s12 push-s3 center">
                <Link to = '/'><h3>HOME</h3></Link>
              </div>
            </div>
            <div className = 'row'>
              <div className="col s12 push-s3 center">
                <h1 className = 'pink-text'>WELCOME!</h1>
              </div>
            </div>
            <div className = 'row'>
              <div className="input-field col s6 push-s6 center">
                <input name= 'id' ref='id' type="text" className="validate" value={this.state.id} onChange={this.handleChange}/>
              </div>
              <label htmlFor='id'>ID</label>
            </div>
            <div className = 'row'>
              <div className="input-field col s6 push-s6 center">
                <input name= 'pw' ref='pw' type="password" className="validate" value={this.state.pw} onChange={this.handleChange}/>
              </div>
              <label htmlFor='pw'>PASSWORD</label>
            </div>
            <div className = 'row'>
              <div className="col s6 push-s6 center">
                <button className="btn waves-effect waves-light pink" type="submit" name="action" onClick={this.handleSignin}>Sign In
                  <i className="material-icons right">vpn_key</i>
                </button>
              </div>
            </div>
            <div className = 'row'>
              <div className = 'col s6 push-s6 center'>
                <Link to='/signup'><button className="btn waves-effect waves-light black">Sign up
                  <i className="material-icons right">person_pin</i>
                </button></Link>
              </div>
            </div>
          </div>

    );
  }
}
Signin.defaultProps = {
  nickname: 'Guest',
};
Signin.propTypes = {
  signinRequest: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => {
  return {
    status: state.authentication.signin.status,
    nickname: state.authentication.status.nickname
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signinRequest: (id, pw) => {
      return dispatch(signinRequest(id,pw));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
