import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Button, Checkbox, Icon, Message, Input, Form, Select} from 'semantic-ui-react';


import { signupRequest, getStatusRequest} from '../actions/authentication';
import { joinChannel, listChannel } from '../actions/channel';
import styles from '../Style.css'


class Signup extends Component{
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      nickname: '',
      channelOptions: [],
      selected:[],
      channelLoading : true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  componentDidMount() {

  }
  //[`${e.target.name}`]: e.target.value
  handleValid = () =>{
    if(this.state.username.length < 4)
      this.setState({idValid : false});
    else
      this.setState({idValid : true});

    if(this.state.password.length < 4)
      this.setState({passwordValid : false});
    else
      this.setState({passwordValid : true});

    if(this.state.nickname.length < 4)
      this.setState({nicknameValid : false});
    else
      this.setState({nicknameValid : true});
  }
  handleUsernameValid = () => {
    if(this.state.username.length < 4)
      return 'error';
    else
      return 'success';
  }
  handleChange(e){
    this.setState({[`${e.target.name}`]: e.target.value});
  }
  handleSignup(e){
    e.preventDefault();
    let username = this.state.username;
    let password = this.state.password;
    let nickname = this.state.nickname;
    var selected = this.state.selected;
    this.props.signupRequest(username, password, nickname)
      .then(() =>{
        if(this.props.signup.status === 'SUCCESS'){
          this.props.joinChannel(selected, username)
            .then(() => {
              this.props.socket.emit('signup participant', selected, username);
              Materialize.toast('Welcome! Please Sign in!', 2000);
              browserHistory.push('/');
            });
        }
        else{
          if(this.props.signup.errCode == (1 || 4)){
            this.setState({username:''}); // username error
          }
          else if(this.props.signup.errCode == (3 || 5)){
            this.setState({nickname:''}); // nickname error
          }
          this.setState({password:''});
          Materialize.toast(this.props.signup.err, 2000);
        }
      } );
  }
  selectedItem = (e, data) => {
    this.setState({
      selected: data.value
    });
  }
  handleLoad = () => {
    this.props.listChannel('*','CHANNEL')
      .then(()=>{
        this.setState({
          channelOptions: this.props.channelList.channels.map((channel, index) => {
            var option = {key : index, value : channel.id, text : channel.name};
            return option;
          }),
          channelLoading: false,
        });
      });
  }
  render(){
    const {channelOptions} = this.state;
    const {channelList} = this.props;
    return(
      <div style = {{'height':'100vh', 'alignItems' : 'center'}}>
        <Message
          attached
          header='Welcome to our site!'
          content='Fill out the form below to sign-up for a new account'
        />
        <Form className='attached fluid segment'>
          <Form.Group widths='equal'>
            <Form.Input name='username' label='Username' placeholder='username' type='text' onChange={this.handleChange}/>
            <Form.Input name='password' label='Password' placeholder='password' type='password' onChange={this.handleChange}/>
          </Form.Group>
          <Form.Input name='nickname' label='Nickname' placeholder='nickname' type='text' onChange={this.handleChange}/>
          <Form.Select multiple selection search label='Channel' placeholder='Select your channel' loading={this.state.channelLoading} options={channelOptions} onClick={this.handleLoad} onChange={this.selectedItem}/>
          <Form.Checkbox inline label='I agree to the terms and conditions' />
          <Button color='blue' onClick={this.handleSignup}>Submit</Button>
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
  channelList : PropTypes.object.isRequired,
  listChannel : PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signup: state.authentication.signup,
    status: state.authentication.status,
    channelList: state.channel.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signupRequest: (username, password, nickname) => {
      return dispatch(signupRequest(username, password, nickname));
    },
    joinChannel: (channels, userName) => {
      return dispatch(joinChannel(channels, userName));
    },
    listChannel: (userName, listType) => {
      return dispatch(listChannel(userName, listType));
    },
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
