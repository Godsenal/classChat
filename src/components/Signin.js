import React, {Component} from 'react';
import {Row, Input} from 'react-materialize';
import { connect } from 'react-redux';
import { signinRequest } from '../actions/authentication';
import { browserHistory } from 'react-router';

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
          let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
          Materialize.toast($toastContent, 2000);
          return false;
        }
      });
  }
  render(){
    return(
      <Row>
        <Input name= 'id' label="ID" s={6} className='center' onChange={this.handleChange}/>
        <Input name= 'pw' type="PASSWORD" label="password" s={6} onChange={this.handleChange}/>
        <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleSignin}>Sign In
          <i className="material-icons right">send</i>
        </button>
      </Row>
    );
  }
}
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
