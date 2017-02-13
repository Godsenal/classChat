import React, {Component} from 'react';
import {Row, Input} from 'react-materialize';
import { connect } from 'react-redux';
import { signupRequest } from '../actions/authentication';
import { browserHistory } from 'react-router';

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
          if(this.props.signup.code == 2){
            this.setState({pw:''});
            this.refs.pw = '';
          }
          else{
            this.setState({id:''});
            this.refs.id = '';
          }
          Materialize.toast(this.props.signup.err, 2000);
        }
      } );
  }
  render(){
    return(
      <Row>
        <Input ref='id' name= 'id' label="ID" s={12} onChange={this.handleChange}/>
        <Input ref='pw' name= 'pw' type="password" label="PASSWORD" s={12} onChange={this.handleChange}/>
        <Input ref='nickname' name= 'nickname' label="NICKNAME" s={12} onChange={this.handleChange}/>
        <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleSignup}>Sign up
          <i className="material-icons right">send</i>
        </button>
      </Row>
    );
  }
}
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
