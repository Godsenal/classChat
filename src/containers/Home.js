import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Icon,Segment, Menu, Button, Image, Divider} from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';

import {Signup, Signin} from '../components';
import {signinRequest, getStatusRequest, signupRequest} from '../actions/authentication';
import {joinChannel, searchChannel} from '../actions/channel';
import styles from '../Style.css';

class Home extends Component{
  constructor(){
    super();
    this.state = {
      success : false,
      activeItem : '',
      signinOpen : false,
      signupOpen : false,
    };
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
  handleChange = (e) => {
    if(e.target.name === 'email')
      this.setState({email: e.target.value});
    else if(e.target.name ==='password')
      this.setState({password: e.target.value});
  }
  handleSigninOpen = () => {
    this.setState({
      signupOpen: false,
      signinOpen: true,
    });
  }
  handleSignupOpen = () => {
    this.setState({
      signinOpen: false,
      signupOpen: true,
    });
  }
  handleSigninClose = () => {
    this.setState({
      signinOpen: false,
    });
  }
  handleSignupClose = (status) => {
    if(status=='SUCCESS'){
      this.addNotification('가입이 완료되었습니다. 로그인 해 주세요!','success','tc');
    }
    this.setState({
      signupOpen: false,
    });
  }
  handleSigninFacebook = () => {
    var url = 'http://' + window.location.host + '/api/account/signinfacebook';
    window.location.href = url;
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render () {
    const {signinOpen, signupOpen} = this.state;
    //<NotificationSystem ref={ref => this.notificationSystem = ref} />

    return(
      <div>
        <Menu inverted style={{'borderRadius':0,'backgroundColor':'#263248'}}  attached='top' borderless>
          <Menu.Item className={styles.logo}><a href='/'><Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗</a></Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item ><Button basic inverted color='olive' onClick={this.handleSigninOpen}>로그인</Button></Menu.Item>
            <Menu.Item ><Button basic inverted color='teal' onClick={this.handleSignupOpen}>회원가입</Button></Menu.Item>
          </Menu.Menu>
        </Menu>
        <div >
          <Segment style={{'borderRadius':0,'backgroundColor':'#263248'}} padded inverted textAlign='center'>
            <span className={styles.homeHeader}>클래스&nbsp;챗</span>
            <br/><br/><br/>
            <Divider horizontal inverted>
              <span className={styles.homeMain}>대학생을 위한 메신저 웹</span>
            </Divider>

          </Segment>
          <Segment style={{'borderRadius':0, 'marginTop':100}} basic padded textAlign='center'>
            <Button style={{'width':'15rem', 'borderRadius':0}} basic color='brown' onClick={this.handleSigninOpen}>시작하기</Button>
            <br/><br/>
            <Button style={{'width':'15rem','borderRadius':0}} color='facebook' onClick={this.handleSigninFacebook}>
              <Icon name='facebook' /> 페이스북으로 시작
            </Button>
          </Segment>
          <Segment style={{'width':'100%','position':'absolute','bottom':0,'borderRadius':0, 'textAlign': 'right'}} basic padded>
            <span>Copyright © Taehee Lee. All Rights Reserved.</span>
          </Segment>
        </div>
        {signinOpen ? <Signin signinOpen={signinOpen}
                              signin={this.props.signin}
                              status={this.props.status}
                              handleSigninOpen={this.handleSigninOpen}
                              handleSignupOpen={this.handleSignupOpen}
                              handleSigninClose={this.handleSigninClose}
                              signinRequest={this.props.signinRequest}
                              getStatusRequest={this.props.getStatusRequest}
                              addNotification={this.addNotification}/>:null }
        {signupOpen ? <Signup signupOpen={signupOpen}
                              socket={this.props.socket}
                              signup={this.props.signup}
                              status={this.props.status}
                              channelSearch={this.props.channelSearch}
                              handleSignupOpen={this.handleSignupOpen}
                              handleSignupClose={this.handleSignupClose}
                              signupRequest={this.props.signupRequest}
                              joinChannel={this.props.joinChannel}
                              searchChannel={this.props.searchChannel}
                              getStatusRequest={this.props.getStatusRequest}
                              addNotification={this.addNotification}/>:null }
        <NotificationSystem ref={ref => this.notificationSystem = ref} />
      </div>
    );
  }
}
Home.defaultProps = {
  signinRequest: () => {console.log('Home props error');},
  getStatusRequest: () => {console.log('Home props error');},
  signupRequest: () => {console.log('Home props error');},
  searchChannel: () => {console.log('Home props error');},
  joinChannel: () => {console.log('Home props error');},
  signin: {},
  signup: {},
  status: {},
  channelSearch: {},
};
Home.propTypes = {
  signinRequest: PropTypes.func.isRequired,
  getStatusRequest : PropTypes.func.isRequired,
  signin : PropTypes.object.isRequired,
  signupRequest : PropTypes.func.isRequired,
  signup : PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  searchChannel : PropTypes.func.isRequired,
  channelSearch : PropTypes.object.isRequired,
  joinChannel : PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signin: state.authentication.signin,
    signup: state.authentication.signup,
    status: state.authentication.status,
    channelSearch: state.channel.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signinRequest: (email, password) => {
      return dispatch(signinRequest(email,password));
    },
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
    signupRequest: (email, username, password, image) => {
      return dispatch(signupRequest(email, username, password, image));
    },
    joinChannel: (channels, userName) => {
      return dispatch(joinChannel(channels, userName));
    },
    searchChannel: (searchWord,type) => {
      return dispatch(searchChannel(searchWord,type));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
