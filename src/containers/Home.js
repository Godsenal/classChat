import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Header, Icon, Menu, Modal, Form, Button} from 'semantic-ui-react';
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
  handleSignin = (e) => {
    e.preventDefault();
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
          this.addNotification('Incorrect username or password','warning','bc');
          this.setState({password : ''});
          return false;
        }
      });

  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render () {
    const {activeItem, modalOpen} = this.state;
    const signinModal = <Modal className={styles.signinModal} open={modalOpen} onClose={this.handleClose} dimmer='blurring' size='small'>
                          <Modal.Header>Sign in</Modal.Header>
                          <Modal.Content>
                            <Form>
                              <Form.Input name='username' label='Username' placeholder='username' type='text' onChange={this.handleChange}/>
                              <Form.Input name='password' label='Password' type='password' onChange={this.handleChange}/>
                            </Form>
                            <Modal.Description>
                              <p>Don't have account yet?&nbsp;<Link to='/signup'>Sign up here</Link>&nbsp;instead.</p>
                            </Modal.Description>
                          </Modal.Content>
                          <Modal.Actions>
                            <Button primary type='submit' onClick={this.handleSignin}>Sign in</Button>
                          </Modal.Actions>
                          <NotificationSystem ref={ref => this.notificationSystem = ref} />
                        </Modal>
    return(
      <div>
        <Menu attached='top'>
          <Menu.Item name='signin' position='right' active={activeItem === 'signin'} onClick={this.handleOpen} />
        </Menu>
        <Header as='h2' icon textAlign='center'>
          <Icon name='users' circular />
          <Header.Content>
            Friends
          </Header.Content>
        </Header>
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
