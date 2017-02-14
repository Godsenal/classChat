import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { signupRequest } from '../actions/authentication';


class Signup extends Component{
  constructor(){
    super();
    this.state = {
      id: '',
      pw: '',
      nickname: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  handleChange(e){
    switch(e.target.name){
    case 'id':
      this.setState({id: e.target.value});
      break;
    case 'pw':
      this.setState({pw: e.target.value});
      break;
    case 'nickname':
      this.setState({nickname: e.target.value});
    }
  }
  handleSignup(){
    let id = this.state.id;
    let pw = this.state.pw;
    let nickname = this.state.nickname;
    this.props.signupRequest(id, pw, nickname)
      .then(() =>{
        if(this.props.signup.status === 'SUCCESS'){
          Materialize.toast('Welcome! Please Sign in!', 2000);
          browserHistory.push('/signin');
        }
        else{
          if(this.props.signup.code == 2){ // pw error
            this.setState({pw:''});
          }
          else if(this.props.signup.code == 1){
            this.setState({id:''}); // id error
          }
          else if(this.props.signup.code == 3){
            this.setState({nickname:''}); // nickname error
          }
          else if(this.props.signup.code == 4){
            this.setState({id:''}); // id error
          }
          Materialize.toast(this.props.signup.err, 2000);
        }
      } );
  }
  render(){
    return(
            <div className = 'container'>
              <div className = 'row'>
                <div className="col s12 push-s3 center">
                  <Link to = '/'><h3>HOME</h3></Link>
                </div>
              </div>
              <div className = 'row'>
                <div className="col s12 push-s3 center">
                  <h1>SIGN UP</h1>
                </div>
              </div>
              <div className = 'row'>
                <div className="input-field col s6 push-s6 center">
                  <input name= 'id' type="text" className="validate" value={this.state.id} onChange={this.handleChange}/>
                </div>
                <label htmlFor='id'>ID</label>
              </div>
              <div className = 'row'>
                <div className="input-field col s6 push-s6 center">
                  <input name= 'pw' type="password" className="validate" value={this.state.pw} onChange={this.handleChange}/>
                </div>
                <label htmlFor='pw'>PASSWORD</label>
              </div>
              <div className = 'row'>
                <div className="input-field col s6 push-s6 center">
                  <input name= 'nickname' type="text" className="validate" value={this.state.nickname} onChange={this.handleChange}/>
                </div>
                <label htmlFor='nickname'>NICKNAME</label>
              </div>
              <div className = 'row'>
                <div className="col s6 push-s6 center">
                  <button className="btn waves-effect waves-light black" type="submit" name="action" onClick={this.handleSignup}>SIGN UP
                    <i className="material-icons right">person_pin</i>
                  </button>
                </div>
              </div>
              <div className = 'row'>
                <div className = 'col s6 push-s6 center'>
                </div>
              </div>
            </div>
    );
  }
}
Signup.propTypes = {
  signupRequest : PropTypes.func.isRequired,
  signup : PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signup: state.authentication.signup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signupRequest: (id, pw, nickname) => {
      return dispatch(signupRequest(id, pw, nickname));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
