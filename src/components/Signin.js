import React, {Component, PropTypes} from 'react';
import {Modal, Form, Button, Image, Icon} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import NotificationSystem from 'react-notification-system';

import styles from '../Style.css';

class Signin extends Component{
  constructor() {
    super();
    this.state= {
      email : '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  addNotification(message, level, position) {
    this.notificationSystem.addNotification({
      message,
      level,
      position,
      autoDismiss: 2,
    });
  }
  handleChange(e){
    this.setState({[`${e.target.name}`]: e.target.value});
  }

  handleKeyPress = (e) => {
    if (e && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSignin();
    }
  }
  handleSignin(e){
    if(e){
      e.preventDefault();
    }
    if(this.state.email == ''){
      this.addNotification('아이디를 입력해주세요.','warning','bc');
      return;
    }
    if(this.state.password == ''){
      this.addNotification('비밀번호를 입력해주세요.','warning','bc');
      return;
    }
    this.props.signinRequest(this.state.email,this.state.password)
      .then(() => {
        if(this.props.signin.status === 'SUCCESS') {
          /*
          let signinData = {
            isSignedIn: true,
            id: this.state.id,
            nickname: this.props.nickname,
            isAdmin: false,
          };
          document.cookie = 'key=' + btoa(JSON.stringify(signinData));*/
          this.props.handleSigninClose();
          browserHistory.push('/channel');
          return true;
        }
        else{
          this.addNotification('이메일 혹은 비밀번호가 잘못되었습니다.','error','bc');
          this.setState({password : ''});
          return false;
        }
      });
  }
  handleSigninFacebook = () => {
    var url = 'http://' + window.location.host + '/api/account/signinfacebook';
    window.location.href = url;
  }
  render(){
    return(
      <Modal className={styles.signinModal} open={this.props.signinOpen} onClose={this.props.handleSigninClose} dimmer='blurring' size='small'>
        <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
          <span className={styles.logo}>
            <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
            <span style={{'float':'right','color':'#E74C3C'}}>로그인</span>
          </span>
        </Modal.Header>
        <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
          <Form>
            <Form.Input name='email' label='이메일' placeholder='이메일' type='text' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
            <Form.Input name='password' label='비밀번호' placeholder='비밀번호' type='password' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
          </Form>
        </Modal.Content>
        <Modal.Content>
          <Button style={{'borderRadius':0}} floated='right' primary type='submit' onClick={this.handleSignin}>로그인</Button>
          <Button style={{'borderRadius':0}} color='facebook' onClick={this.handleSigninFacebook}>
            <Icon name='facebook' /> 페이스북으로 로그인
          </Button>
        </Modal.Content>

        <NotificationSystem ref={ref => this.notificationSystem = ref} />
      </Modal>
    );
  }
}
Signin.defaultProps = {
  nickname: 'Guest',
};
Signin.propTypes = {
  signinOpen: PropTypes.bool.isRequired,
  handleSigninClose: PropTypes.func.isRequired,
  signinRequest: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  signin: PropTypes.object.isRequired,
  nickname: PropTypes.string.isRequired,
};

export default Signin;
