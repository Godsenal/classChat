import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Header, Icon,Segment, Menu, Modal, Form, Button, Image, Divider} from 'semantic-ui-react';
import {Link, browserHistory} from 'react-router';
import NotificationSystem from 'react-notification-system';

import {signinRequest, getStatusRequest} from '../actions/authentication';
import styles from '../Style.css';
class Home extends Component{
  constructor(){
    super();
    this.state = {
      success : false,
      activeItem : '',
      modalOpen : false,
      username : '',
      password: '',
    };
    this.addNotification = this.addNotification.bind(this);
  }
  componentDidMount() {

  }
  addNotification(message, level, position) {
    this.notificationSystem.addNotification({
      message,
      level,
      position,
      autoDismiss: 2,
    });
  }
  handleChange = (e) => {
    if(e.target.name === 'username')
      this.setState({username: e.target.value});
    else if(e.target.name ==='password')
      this.setState({password: e.target.value});
  }
  handleOpen = () => {
    this.setState({
      modalOpen: true,
    });
  }
  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSignin();
    }
  }
  handleSignin = (e) => {
    if(e){
      e.preventDefault();
    }
    if(this.state.username == ''){
      this.addNotification('아이디를 입력해주세요.','warning','bc');
      return;
    }
    if(this.state.password == ''){
      this.addNotification('비밀번호를 입력해주세요.','warning','bc');
      return;
    }
    this.props.signinRequest(this.state.username,this.state.password)
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
          this.handleClose();
          browserHistory.push('/channel');
          return true;
        }
        else{
          this.addNotification('아이디나 비밀번호가 잘못되었습니다.','warning','bc');
          this.setState({password : ''});
          return false;
        }
      });

  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render () {
    const {activeItem, modalOpen} = this.state;
    const signinModal = <Modal className={styles.signinModal} open={modalOpen} onClose={this.handleClose} dimmer='blurring' size='small'>
                          <Modal.Header style={{'textAlign':'center'}}>로그인</Modal.Header>
                          <Modal.Content>
                            <Form>
                              <Form.Input name='username' label='아이디' placeholder='아이디' type='text' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
                              <Form.Input name='password' label='비밀번호' placeholder='비밀번호' type='password' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
                            </Form>
                            <Modal.Description>
                              <p>아직 아이디가 없으신가요?  &nbsp;<Link to='/signup'><b>여기</b></Link>서&nbsp; 회원가입 하세요.</p>
                            </Modal.Description>
                          </Modal.Content>
                          <Modal.Actions>
                            <Button primary basic type='submit' onClick={this.handleSignin}>로그인</Button>
                          </Modal.Actions>
                          <NotificationSystem ref={ref => this.notificationSystem = ref} />
                        </Modal>;
    return(
      <div>
        <Menu inverted style={{'borderRadius':0,'backgroundColor':'#1E1E20'}}  attached='top' borderless>
          <Menu.Item className={styles.logo}><a href='/'><Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗</a></Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item ><Button basic inverted color='olive' onClick={this.handleOpen}>로그인</Button></Menu.Item>
            <Menu.Item ><Button basic inverted color='teal' onClick={this.handleOpen}>회원가입</Button></Menu.Item>
          </Menu.Menu>
        </Menu>
        <div >
          <Segment style={{'borderRadius':0,'backgroundColor':'#1E1E20'}} padded inverted textAlign='center'>
            <span className={styles.homeHeader}>클래스&nbsp;챗</span>
            <br/><br/><br/>
            <Divider horizontal inverted>
              <span className={styles.homeMain}>대학생을 위한 메신저 웹</span>
            </Divider>
            <br/><br/>
            <span className={styles.homeMain}><Icon name='comment'/><Icon name='search'/><Icon name='group'/></span>
            <br/><br/>
            <span className={styles.homeMain}>모든 것을 여기서</span>

          </Segment>
          <Segment style={{'borderRadius':0}} basic padded textAlign='center'>
            <Button style={{'width':'20%'}} basic color='brown' onClick={this.handleOpen}>시작하기</Button>

          </Segment>
          <Segment style={{'width':'100%','position':'absolute','bottom':0,'borderRadius':0, 'textAlign': 'right'}} basic padded>
            <span>Copyright © Taehee Lee. All Rights Reserved.</span>
          </Segment>
        </div>
        {signinModal}
      </div>
    );
  }
}

Home.defaultProps = {
  nickname: 'Guest',
};
Home.propTypes = {
  signinRequest: PropTypes.func.isRequired,
  getStatusRequest : PropTypes.func.isRequired,
  signin : PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  nickname: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signin: state.authentication.signin,
    status: state.authentication.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signinRequest: (username, password) => {
      return dispatch(signinRequest(username,password));
    },
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
