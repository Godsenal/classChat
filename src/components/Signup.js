import React, {Component, PropTypes} from 'react';
import { Button, Form, Modal, Image} from 'semantic-ui-react';

import styles from '../Style.css'


class Signup extends Component{
  constructor(){
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      passwordCheck: '',
      channelOptions: [],
      selected:[],
      channelLoading : true,
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
          }),
          channelLoading: false,
        });
      });
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
    if(this.state.password !== this.state.passwordCheck){
      this.setState({
        password: '',
        passwordCheck: '',
      });
    }
    let email = this.state.email;
    let username = this.state.username;
    let password = this.state.password;
    var selected = this.state.selected;
    this.props.signupRequest(email, username, password)
      .then(() =>{

        if(this.props.signup.status === 'SUCCESS'){
          this.props.joinChannel(selected, username)
            .then(() => {
              this.props.socket.emit('signup participant', selected, username);
              this.props.handleSignupClose();
            });
        }
        else{
          if(this.props.signup.errCode == 1){
            this.setState({email:''}); // BAD EMAIL
          }
          else if(this.props.signup.errCode == 3){
            this.setState({username:''}); // BAD USERNAME
          }
          else if(this.props.signup.errCode == 4){
            this.setState({email:''}); // EMAIL EXIST
          }
          else if(this.props.signup.errCode == 5){
            this.setState({username:''}); // USERNAME EXIST
          }
          else{
            this.setState({username:''}); // NETWORK ERROR
          }
          this.setState({
            password:'',
            passwordCheck: ''
          });
        }
      } );
  }
  selectedItem = (e, data) => {
    this.setState({
      selected: data.value
    });
  }
  render(){
    const {channelOptions ,email, username, password, passwordCheck} = this.state;
    return(
        <Modal className={styles.signinModal} open={this.props.signupOpen} onClose={this.props.handleSignupClose} dimmer='blurring' size='small'>
          <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
            <span className={styles.logo}>
              <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
              <span style={{'float':'right','color':'#E74C3C'}}>회원가입</span>
            </span>
          </Modal.Header>
          <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
            <Form className='attached fluid segment' style={{'textAlign':'left'}}>
              <Form.Input name='email' value={email} label='이메일' placeholder='이메일' type='email' onChange={this.handleChange}/>
              <Form.Input name='username' value={username} label='이름' placeholder='이름' type='text' onChange={this.handleChange}/>
              <Form.Input name='password' value={password} label='비밀번호' placeholder='비밀번호' type='password' onChange={this.handleChange}/>
              <Form.Input name='passwordCheck' value={passwordCheck} label='비밀번호 확인' placeholder='비밀번호 확인' type='password' onChange={this.handleChange}/>
              <Form.Select multiple selection search label='채널' placeholder='채널 선택' loading={this.state.channelLoading} options={channelOptions} onChange={this.selectedItem}/>
            </Form>
          </Modal.Content>
          <Modal.Actions style={{'backgroundColor':'#ECF0F1'}}>
            <Button primary basic type='submit' onClick={this.handleSignup}>가입</Button>
          </Modal.Actions>
        </Modal>
    );
  }
}
Signup.propTypes = {
  signupOpen: PropTypes.bool.isRequired,
  handleSignupClose: PropTypes.func.isRequired,
  signupRequest : PropTypes.func.isRequired,
  signup : PropTypes.object.isRequired,
  channelList : PropTypes.object.isRequired,
  listChannel : PropTypes.func.isRequired,
  joinChannel : PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
};
export default Signup;
