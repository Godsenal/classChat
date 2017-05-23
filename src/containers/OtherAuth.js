import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Form, Button, Modal, Image, Card} from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';

import {otherAuthRequest} from '../actions/authentication';
import {joinChannel, searchChannel} from '../actions/channel';
import styles from '../Style.css';

const imgPath = '/assets/images/users/basic/';

class OtherAuth extends Component{
  constructor(){
    super();
    this.state = {
      email: '',
      username: '',
      channelOptions: [],
      selected:[],
      channelLoading : true,
      profileImg : 'profile1',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  getCookie(name) {
    var regexp = new RegExp('(?:^' + name + '|;\s*'+ name + ')=(.*?)(?:;|$)', 'g');
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
    this.addNotification('인증이 완료되었습니다. 프로필을 입력해주세요.','success','tc');
    this.setState({
      email
    });
    this.props.searchChannel('*','CHANNEL')
      .then(()=>{
        var channelOptions = this.props.channelSearch.channels.map((channel, index) => {
          var option = {key : index, value : channel.id, text : channel.name};
          return option;
        });
        for(var i=0; i<channelOptions.length; i++){
          channelOptions.splice(i,1);
          break;
        }
        this.setState({
          channelOptions,
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
    let profileImg = this.state.profileImg;
    var selected = this.state.selected;
    this.props.otherAuthRequest(email, username, profileImg)
      .then(() =>{
        if(this.props.signup.status === 'SUCCESS'){
          selected.push('1');
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
            this.addNotification('잘못된 유저 이름 입니다.','error','bc');
          }
          else if(this.props.signup.errCode == 4){
            browserHistory.push('/'); // 수정 필요. 이메일이 중복 되었을 때,
          }
          else if(this.props.signup.errCode == 5){
            this.setState({username:''}); // USERNAME EXIST
            this.addNotification('이미 사용중인 유저 이름 입니다.','error','bc');
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
  changeImg =(e) =>{
    this.setState({
      profileImg: 'profile'+e.target.value,
    });
  }
  render () {

    const {channelOptions ,username, profileImg} = this.state;
    return(
      <Modal className={styles.signinModal} open={true} dimmer='blurring' size='small'>
        <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
          <span className={styles.logo}>
            <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
            <span style={{'float':'right','color':'#E74C3C'}}>사용자 설정</span>
          </span>
        </Modal.Header>
        <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
          <Card centered>
            <Card.Content>
              <Card.Header>
                <span className={styles.logo}>
                  프로필 이미지
                </span>
              </Card.Header>
            </Card.Content>
            <Image ref={img => this.img=img} centered width={100} src={`${imgPath}${profileImg}.png`} onError={()=>this.img.src = imgPath+'profile1.png'}/>
            <Card.Content style={{'textAlign':'center'}}>
              <Button.Group basic size='small'>
                <Button value ='1' onClick={this.changeImg}>1</Button>
                <Button value ='2' onClick={this.changeImg}>2</Button>
                <Button value ='3' onClick={this.changeImg}>3</Button>
                <Button value ='4' onClick={this.changeImg}>4</Button>
                <Button value ='5' onClick={this.changeImg}>5</Button>
              </Button.Group>
            </Card.Content>
          </Card>
          <Form className='attached fluid segment' style={{'textAlign':'left'}}>
            <Form.Input name='username' value={username} label='이름' placeholder='이름' type='text' onChange={this.handleChange}/>
            <Form.Select multiple selection search label='채널' placeholder='채널 선택' loading={this.state.channelLoading} options={channelOptions} onChange={this.selectedItem}/>
          </Form>
        </Modal.Content>
        <Modal.Actions style={{'backgroundColor':'#ECF0F1'}}>
          <Button primary basic type='submit' onClick={this.handleSignup}>가입</Button>
        </Modal.Actions>
        <NotificationSystem ref={ref => this.notificationSystem = ref} />
      </Modal>
    );
  }
}
OtherAuth.defaultProps = {
  searchChannel: () => {console.log('Home props error');},
  joinChannel: () => {console.log('Home props error');},
  signup: {},
  channelSearch: {},
};
OtherAuth.propTypes = {
  signup : PropTypes.object.isRequired,
  channelSearch : PropTypes.object.isRequired,
  searchChannel : PropTypes.func.isRequired,
  joinChannel : PropTypes.func.isRequired,
  otherAuthRequest: PropTypes.func.isRequired,
  socket:PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    signup: state.authentication.signup,
    channelSearch: state.channel.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    otherAuthRequest: (email,username, image) => {
      return dispatch(otherAuthRequest(email,username, image));
    },
    joinChannel: (channels, userName) => {
      return dispatch(joinChannel(channels, userName));
    },
    searchChannel: (searchWord,type) => {
      return dispatch(searchChannel(searchWord,type));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherAuth);
