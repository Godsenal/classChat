import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import {Grid, Header, Divider, Icon} from 'semantic-ui-react';
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
          if(this.props.signup.errCode == (1 || 4)){
            this.setState({id:''}); // id error
          }
          else if(this.props.signup.errCode == (3 || 5)){
            this.setState({nickname:''}); // nickname error
          }
          this.setState({pw:''});
          Materialize.toast(this.props.signup.err, 2000);
        }
      } );
  }
  render(){
    return( <div>
              <div className = 'row'>
                <Header size='huge'><Link to = '/'><Icon name='home'/>HOME</Link></Header>
              </div>
              <div className = 'row'>
                  <Header size='huge'>SIGN UP</Header>
              </div>
              <div className = 'row'>
                <div className="input-field">
                  <input name= 'id' type="text" className="validate" value={this.state.id} onChange={this.handleChange}/>
                  <label htmlFor='id'>ID</label>
                </div>
              </div>
              <div className = 'row'>
                <div className="input-field">
                  <input name= 'pw' type="password" className="validate" value={this.state.pw} onChange={this.handleChange}/>
                  <label htmlFor='pw'>PASSWORD</label>
                </div>
              </div>
              <div className = 'row'>
                <div className="input-field">
                  <input name= 'nickname' type="text" className="validate" value={this.state.nickname} onChange={this.handleChange}/>
                  <label htmlFor='nickname'>NICKNAME</label>
                </div>
              </div>
              <div className = 'row'>
                  <button className="btn waves-effect waves-light black" type="submit" name="action" onClick={this.handleSignup}>SIGN UP
                    <i className="material-icons right">person_pin</i>
                  </button>
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
