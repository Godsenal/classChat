import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Button, Checkbox, Icon, Message, Input, Form, Select} from 'semantic-ui-react';
import { signupRequest } from '../actions/authentication';
import { joinChannel, listChannel } from '../actions/channel';
import styles from '../Style.css'


class Signup extends Component{
  constructor(){
    super();
    this.state = {
      id: '',
      pw: '',
      nickname: '',
      channelOptions: [],
      selected:[],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  componentDidMount() {
    this.props.listChannel('*','CHANNEL')
      .then(()=>{
        this.setState({
          channelOptions: this.props.channelList.channels.map((channel, index) => {
            var option = {key : index, value : channel.id, text : channel.name};
            return option;
          })
        });
      });
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
  handleSignup(e){
    e.preventDefault();
    let id = this.state.id;
    let pw = this.state.pw;
    let nickname = this.state.nickname;
    var selected = this.state.selected;
    this.props.signupRequest(id, pw, nickname)
      .then(() =>{
        if(this.props.signup.status === 'SUCCESS'){
          this.props.joinChannel(selected, id)
            .then(() => {
              Materialize.toast('Welcome! Please Sign in!', 2000);
              browserHistory.push('/');
            });
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
    this.setState({
      selected: data.value
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
            <Form.Input name='id' label='ID' placeholder='id' type='text' onChange={this.handleChange}/>
            <Form.Input name='pw' label='Password' placeholder='password' type='password' onChange={this.handleChange}/>
          </Form.Group>
          <Form.Input name='nickname' label='Username' placeholder='username' type='text' onChange={this.handleChange}/>
          <Form.Select multiple selection search label='Channel' placeholder='Select your channel' options={channelOptions} onChange={this.selectedItem}/>
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
};
const mapStateToProps = (state) => {
  return {
    signup: state.authentication.signup,
    channelList: state.channel.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signupRequest: (id, pw, nickname) => {
      return dispatch(signupRequest(id, pw, nickname));
    },
    joinChannel: (channels, userName) => {
      return dispatch(joinChannel(channels, userName));
    },
    listChannel: (userName, listType) => {
      return dispatch(listChannel(userName, listType));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
