import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Button, Checkbox, Icon, Message, Input, Form, Select} from 'semantic-ui-react';
import { signupRequest } from '../actions/authentication';
import styles from '../Style.css'

const channelOptions = [{key: '1', value: '1', text: '자료구조'},{key: '2', value: '2', text: '알고리즘'}];
class Signup extends Component{
  constructor(){
    super();
    this.state = {
      id: '',
      pw: '',
      nickname: '',
      idValid: false,
      pwValid: false,
      nicknameValid: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  //[`${e.target.name}`]: e.target.value
  handleValid = () =>{
    if(this.state.id.length < 4)
      this.setState({idValid : false});
    else
      this.setState({idValid : true});

    if(this.state.pw.length < 4)
      this.setState({pwValid : false});
    else
      this.setState({pwValid : true});

    if(this.state.nickname.length < 4)
      this.setState({nicknameValid : false});
    else
      this.setState({nicknameValid : true});
  }
  handleIdValid = () => {
    if(this.state.id.length < 4)
      return 'error';
    else
      return 'success';
  }
  handleChange(e){
    this.setState({[`${e.target.name}`]: e.target.value});
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
  selectedItem = (e, data) => {
    console.log(data.value);
  }
  render(){
    const {idValid, pwValid, nicknameValid} = this.state;
    return(
      <div style = {{'height':'100vh', 'alignItems' : 'center'}}>
        <Message
          attached
          header='Welcome to our site!'
          content='Fill out the form below to sign-up for a new account'
        />
        <Form className='attached fluid segment'>
          <Form.Group widths='equal'>
            <Form.Input name='id' label='ID' placeholder='id' type='text' onChange={this.handleChange}/>
            <Form.Input name='pw' label='Password' placeholder='password' type='password' onChange={this.handleChange}/>
          </Form.Group>
          <Form.Input label='Username' placeholder='username' type='text' />
          <Form.Select multiple selection search label='Channel' placeholder='Select your channel' options={channelOptions} onChange={this.selectedItem}/>
          <Form.Checkbox inline label='I agree to the terms and conditions' />
          <Button color='blue'>Submit</Button>
        </Form>
        <Message attached='bottom' warning>
          <Icon name='help' />
          Already signed up?&nbsp;<Link to='/signin'>Sign in here</Link>&nbsp;instead.
        </Message>
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
