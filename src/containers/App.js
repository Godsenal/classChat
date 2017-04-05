import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import NotificationSystem from 'react-notification-system';
import io from 'socket.io-client';
import {browserHistory} from 'react-router';
import { getStatusRequest, signoutRequest} from '../actions/authentication';
import { initEnvironment, connectSocket} from '../actions/environment';

import Bluebird from 'bluebird';
// Node
global.Promise = Bluebird;
// Browser
window.Promise = Bluebird;

const socket = io.connect();
class App extends Component{
  constructor(props){
    super(props);
    this.state={
      side : false,
      width: window.innerWidth,
      activeItem: 'home',
      getChannel: false,
    };
    this.handleSignout = this.handleSignout.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  addNotification(notification) {
    this.notificationSystem.addNotification(notification);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.notification !== nextProps.notification)
      this.addNotification(nextProps.notification);
  }
  componentDidMount() {
    this.props.getStatusRequest()
      .then(()=>{
        if(this.props.status.valid){
          browserHistory.push('/channel');
        }
      });
  }
  componentWillMount() {


    this.props.initEnvironment();
    //window.addEventListener('resize', this.handleWindowSizeChange);
  }
  /*handleWindowSizeChange = () => {
    this.props.initEnvironment();
  };*/
  toggleSide = () => {
    this.setState({
      side : !this.state.side,
    });
  }
  handleSignout(){
    this.props.signoutRequest().then(
      () => {
        Materialize.toast('Good Bye!', 2000);
        let signinData = {
          isSignedIn: false,
          id: '',
          nickname: '',
          isAdmin: false,
        };
        document.cookie = 'key=' + btoa(JSON.stringify(signinData));
      }
    );
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render(){
    //const re = /(signin|signup)/;
    //const isAuth = re.test(this.props.location.pathname); // test current location is whether signin or signup
    /* Mobile Setting */
    //const { width } = this.state;
    //const isMobile = width <= 600;
    //const marginContent = ((!isMobile&&!isAuth)?150:0);
    //const side = ((this.state.side||!isMobile)&&!isAuth?true:false);
    //const {screenHeight, isMobile, screenWidth} = this.props.environment;
    //const sideAnim = (isMobile?'slide along':'overlay');
    /* Mobile Setting */
    /*const userInfo = (this.props.status.isSignedIn?
                                                  <Menu.Item>
                                                    <Menu.Header>
                                                      <a><Icon name='user' />{this.props.status.currentUserNickname}</a>
                                                    </Menu.Header>
                                                    <Menu.Menu>
                                                      <Menu.Item><a href='' onClick={this.handleSignout}><Icon name='sign out' />Sign out</a></Menu.Item>
                                                    </Menu.Menu>
                                                    <Menu.Item>
                                                      <Link to='/channel' onClick={this.toggleSide}><span><Icon name='chain' />Channel</span></Link>
                                                    </Menu.Item>
                                                  </Menu.Item>
                                                  :
                                                  <Menu.Item>
                                                    <Menu.Menu>
                                                      <Menu.Item>
                                                        <Link to='/signin' onClick={this.toggleSide}><span><Icon name='sign in' />Sign in</span></Link>
                                                      </Menu.Item>
                                                      <Menu.Item>
                                                        <Link to='/signup' onClick={this.toggleSide}><span><Icon name='signup' />Sign up</span></Link>
                                                      </Menu.Item>
                                                      <Menu.Item>
                                                        <Link to='/channel' onClick={this.toggleSide}><span><Icon name='chain' />Channel</span></Link>
                                                      </Menu.Item>
                                                    </Menu.Menu>
                                                  </Menu.Item>);*/

    /*const header = (isAuth?null:
                            <div className='navbar-fixed'>
                              <nav>
                                <div className="nav-wrapper black">
                                  {(isMobile?
                                  <ul id="nav-mobile" className="left">
                                    <a onClick={this.toggleSide}><i className="material-icons">reorder</i></a>
                                  </ul>:null)}
                                  <Link to='/' className="brand-logo center" style={{'textDecoration' : 'none'}}>TAEHEE LEE</Link>
                                </div>
                              </nav>
                            </div>);*/


    return(
      <div>
        {this.props.children && React.cloneElement(this.props.children, {
          socket
        })}
        <NotificationSystem ref={ref => this.notificationSystem = ref} />
      </div>
    );
  }

}

App.defaultProps ={
  getStatusRequest: ()=> {console.log('App props Error');},
  signoutRequest: ()=> {console.log('App props Error');},
  initEnvironment : () => {console.log('App props Error');},
  status : {},
  environment : {},
  notification : {},
};
App.propTypes = {
  getStatusRequest : PropTypes.func.isRequired,
  signoutRequest : PropTypes.func.isRequired,
  status : PropTypes.object.isRequired,
  environment : PropTypes.object.isRequired,
  initEnvironment : PropTypes.func.isRequired,
  notification : PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    status: state.authentication.status,
    environment: state.environment,
    notification: state.environment.notification,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
    signoutRequest: () => {
      return dispatch(signoutRequest());
    },
    initEnvironment: () => {
      return dispatch(initEnvironment());
    },
    connectSocket: (socket) => {
      return dispatch(connectSocket(socket));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
