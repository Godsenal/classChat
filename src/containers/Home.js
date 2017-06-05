import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Icon,Segment, Card, Button, Image,} from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import {spring,
Motion,
StaggeredMotion,
TransitionMotion,
presets} from 'react-motion';
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
      showButton : false,
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
  showButton = () => {
    this.setState({
      showButton: true,
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
      <div className={styles.homeContainer }>
          <Motion defaultStyle={{left: 0, }} style={{left: spring(50,{stiffness: 120, damping: 30})}} onRest={this.showButton}>
            {interpolatingStyle =><div className={styles.homeMain} style={{'left':interpolatingStyle.left +'%'}}>
              ClassChat
            </div>}
          </Motion>
          {this.state.showButton? <div className={styles.homeBtn} >
              <Motion defaultStyle={{width: 500,opacity:0}} style={{opacity:spring(1,{stiffness: 50, damping: 15}),width: spring(200,{stiffness: 50, damping: 15})}}>
                  {interpolatingStyle => <Button basic style={{'width':interpolatingStyle.width,'opacity':interpolatingStyle.opacity}} color='brown' onClick={this.handleSigninOpen}>시작하기</Button>}
              </Motion>

              <br/><br/>
              <Motion defaultStyle={{width: 500, opacity:0}} style={{opacity:spring(1,{stiffness: 50, damping: 15}),width: spring(200,{stiffness: 50, damping: 15})}}>
              {interpolatingStyle =><Button style={interpolatingStyle} color='facebook' onClick={this.handleSigninFacebook}>
                <Icon name='facebook' /> 페이스북으로 시작
              </Button>}
              </Motion>
            </div>:undefined}
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
