import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Form, Button, Modal, Image} from 'semantic-ui-react';

import {otherAuthRequest} from '../actions/authentication';
import {joinChannel, listChannel} from '../actions/channel';
import styles from '../Style.css';

class OtherAuth extends Component{
  constructor(){
    super();
    this.state = {
      email: '',
      username: '',
      channelOptions: [],
      selected:[],
      channelLoading : true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  getCookie(name) {
    var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
    var result = regexp.exec(document.cookie);
    return (result === null) ? null : result[1];
  }
  deleteCookie(name) {
  // If the cookie exists
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  componentDidMount() {

    var email = this.getCookie('email');
    email = decodeURIComponent(email);
    if(!email){
      browserHistory.push('/');
    }
    this.setState({
      email
    });
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
  addNotification(message, level, position) {
    this.notificationSystem.addNotification({
      message,
      level,
      position,
      autoDismiss: 2,
    });
  }
  handleSignup(e){
    e.preventDefault();
    let email = this.state.email;
    let username = this.state.username;
    var selected = this.state.selected;
    this.props.otherAuthRequest(email, username)
      .then(() =>{
        if(this.props.signup.status === 'SUCCESS'){
          console.log(this.props.signup);
          this.props.joinChannel(selected, username)
            .then(() => {
              this.props.socket.emit('signup participant', selected, username);
              var url = 'http://' + window.location.host + '/api/account/signinfacebook';
              window.location.href = url;
            });
        }
        else{
          if(this.props.signup.errCode == 2){
            this.setState({username:''}); // BAD USERNAME
          }
          else if(this.props.signup.errCode == 4){
            browserHistory.push('/'); // 수정 필요. 이메일이 중복 되었을 때,
          }
          else if(this.props.signup.errCode == 5){
            this.setState({username:''}); // USERNAME EXIST
          }
          else{
            this.setState({username:''}); // NETWORK ERROR
          }
        }
      });
  }
  handleChange = (e) => {
    this.setState({[`${e.target.name}`]: e.target.value});
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  selectedItem = (e, data) => {
    this.setState({
      selected: data.value
    });
  }
  render () {

    const {channelOptions ,username} = this.state;
    return(
      <Modal className={styles.signinModal} open={true} dimmer='blurring' size='small'>
        <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
          <span className={styles.logo}>
            <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
            <span style={{'float':'right','color':'#E74C3C'}}>사용자 설정</span>
          </span>
        </Modal.Header>
        <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
          <Form className='attached fluid segment' style={{'textAlign':'left'}}>
            <Form.Input name='username' value={username} label='이름' placeholder='이름' type='text' onChange={this.handleChange}/>
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
OtherAuth.defaultProps = {
  listChannel: () => {console.log('Home props error');},
  joinChannel: () => {console.log('Home props error');},
  signup: {},
  channelList: {},
};
OtherAuth.propTypes = {
  signup : PropTypes.object.isRequired,
  channelList : PropTypes.object.isRequired,
  listChannel : PropTypes.func.isRequired,
  joinChannel : PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signup: state.authentication.signup,
    channelList: state.channel.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    otherAuthRequest: (email,username) => {
      return dispatch(otherAuthRequest(email,username));
    },
    joinChannel: (channels, userName) => {
      return dispatch(joinChannel(channels, userName));
    },
    listChannel: (userName, listType) => {
      return dispatch(listChannel(userName, listType));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherAuth);
