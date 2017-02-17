import React,{Component, PropTypes} from 'react';
import { Sidebar, Segment, Button, Menu, Icon, Header, Dropdown } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { getStatusRequest, signoutRequest} from '../actions/authentication';

//import {Sidebar} from '../components';


class App extends Component{
  constructor(){
    super();
    this.state={
      side : false,
      width: window.innerWidth,
    };
    this.handleSignout = this.handleSignout.bind(this);
  }
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }
  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };
  toggleSide = () => {
    this.setState({
      side : !this.state.side,
    });
  }
  getCookie(name){
    var value = '; '+ document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }
  componentDidMount() {
        // get login data from cookie
    let signinData = this.getCookie('key');

        // if loginData is undefined, do nothing
    if(typeof signinData === 'undefined') return;

        // decode base64 & parse json
    signinData = JSON.parse(atob(signinData));

        // if not logged in, do nothing
    if(!signinData.isSignedIn) return;

        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
      () => {
        if(!this.props.status.valid) {
                    // if session is not valid
                    // logout the session
          signinData = {
            isSignedIn: false,
            id: '',
            nickname: '',
            isAdmin: false,
          };

          document.cookie = 'key=' + btoa(JSON.stringify(signinData));

          Materialize.toast('Your session is expired, please sign in again', 4000);
        }
      }
    );

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
  render(){

    const re = /(signin|signup)/;
    const isAuth = re.test(this.props.location.pathname); // test current location is whether signin or signup
    /* Mobile Setting */
    const { width } = this.state;
    const isMobile = width <= 600;
    const marginContent = ((!isMobile&&!isAuth)?150:0);
    const side = ((this.state.side||!isMobile&&!isAuth)?true:false);
    //const sideAnim = (isMobile?'slide along':'overlay');
    /* Mobile Setting */
    const userInfo = (this.props.status.isSignedIn?
                                                  <Menu.Item>
                                                    <Menu.Header>
                                                      <a><Icon name='user' />{this.props.status.currentUserNickname}</a>
                                                    </Menu.Header>
                                                    <Menu.Menu>
                                                      <Menu.Item><a href='' onClick={this.handleSignout}><Icon name='sign out' />Sign out</a></Menu.Item>
                                                    </Menu.Menu>
                                                  </Menu.Item>
                                                  :<Menu.Menu>
                                                  <Menu.Item>
                                                    <a><Link to='/signin'><span><Icon name='sign in' />Sign in</span></Link></a>
                                                   </Menu.Item>
                                                   <Menu.Item>
                                                    <a><Link to='/signup'><span><Icon name='signup' />Sign up</span></Link></a>
                                                   </Menu.Item></Menu.Menu>);

    const header = (isAuth?null:
                            <div className='navbar-fixed'>
                              <nav>
                                <div className="nav-wrapper black">
                                  {(isMobile?
                                  <ul id="nav-mobile" className="left">
                                    <a onClick={this.toggleSide}><i className="material-icons">reorder</i></a>
                                  </ul>:null)}
                                  <Link to='/'
                                        className="brand-logo right"
                                        style={{'textDecoration' : 'none'}}>TAEHEE LEE</Link>
                                </div>
                              </nav>
                            </div>);

    return(
      <div>
        {header}
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='overlay' width='thin' visible={side} icon='labeled' vertical inverted>
            <Menu.Item name='home'>
              <Link to='/' onClick={this.toggleSide}>
                <Icon name='home' />
                HOME
              </Link>
            </Menu.Item>
            <Menu.Item name='tech'>
              <Link to='notice' onClick={this.toggleSide}>
                <Menu.Header>
                  <Menu.Item>
                  <Icon name='computer' />
                  TECH
                  </Menu.Item>
                </Menu.Header>
              </Link>
              <Menu.Menu>
                <Menu.Item name='react' >
                  <Link to='/'>
                    <Icon name='computer' />
                    REACT
                  </Link>
                </Menu.Item>
                <Menu.Item name='react' >
                  <Link to='/'>
                    <Icon name='computer' />
                    REACT
                  </Link>
                </Menu.Item>
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
            <Menu.Item>
              <Menu.Header>Products</Menu.Header>
              <Menu.Menu>
                <Menu.Item name='enterprise'  />
                <Menu.Item name='consumer'/>
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
              <Menu.Header>Products</Menu.Header>
              <Menu.Menu>
                <Menu.Item name='enterprise'  />
                <Menu.Item name='consumer'/>
              </Menu.Menu>
            </Menu.Item>
            {userInfo}
          </Sidebar>
          <Sidebar.Pusher>
            <Segment padded style={{'marginLeft' : marginContent}}>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        </div>
    );
  }

}

App.propTypes = {
  getStatusRequest : PropTypes.func.isRequired,
  signoutRequest : PropTypes.func.isRequired,
  status : PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    status: state.authentication.status,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
