import React,{Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Popup, Button, Image, Icon,  Segment, Divider, Modal } from 'semantic-ui-react';
import moment from 'moment';
import styles from '../Style.css';

class Message extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageStatus : 'loading',
      hiddenImage : true,

    };
  }
  componentDidMount() {
    if(this.props.lastDateID === this.props.id){
      if(this.unReadMessage){
        var unReadNode = ReactDOM.findDOMNode(this.unReadMessage);
        this.props.scrollIntoDate(unReadNode);
      }
    }
    else if (this.props.isReceived) {
      if(this.message ){
        var messageNode = ReactDOM.findDOMNode(this.unReadMessage);
        this.props.scrollIntoReceive(messageNode);
      }
    }
  }
  componentWillReceiveProps(nextProps) { // messageJumpID 는 무조건 이미 render된 메시지 안에서 하므로
    if(this.props.messageJumpID !== nextProps.messageJumpID){
      if(nextProps.messageJumpID === this.props.id){
        if(this.message){
          this.message.classList.remove(styles.fadeInAnimation);
          void this.message.offsetWidth;
          this.message.classList.add(styles.fadeInAnimation); //reset animation

          var jumpNode = ReactDOM.findDOMNode(this.message);
          this.props.scrollIntoJump(jumpNode);
        }
      }
    }
  }
  handleImageLoad = () => {
    this.setState({ imageStatus: 'loaded' }); // onload

  }
  handleToggleImage = () => {
    this.setState({ hiddenImage : !this.handleToggleImage});
    /*var itemComponent = this.image;

    if (itemComponent) {
      var domNode = ReactDOM.findDOMNode(itemComponent);
      domNode.scrollIntoView(true); //이 위치로 이동
    }*/
  }
  handleAddGroup = (userName) => {
    var sortParticipants = [this.props.currentUser, userName].sort();
    var group ={
      name: (sortParticipants[0] + '+' + sortParticipants[1]),
      participants : sortParticipants,
      type : 'DIRECT',
    };
    this.props.addGroup(group);
  }
  render () {
    //const urlRE= new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
    //const urlContents = this.props.contents.match(urlRE);
    const myMessage = (this.props.currentUser === this.props.userName)?
      <div>HI {this.props.currentUser}</div>
      :<Button onClick={ () => this.handleAddGroup(this.props.userName)}>1:1 채팅하기</Button>;
    const waitingStyle =  !this.props.isWaiting?styles.flexMessage:styles.flexMessageWaiting;
    const contents = this.props.types === 'message'?
                  <div>
                    <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}>
                      {this.props.contents}
                    </p>
                  </div>
                    :this.props.types === 'application'?<a href={`/api/download/${this.props.types}/${this.props.url}/${this.props.contents}`} download>
                      <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}><Icon name='file'/>{this.props.contents}</p></a>
                      :<Segment basic compact>
                      <Modal basic trigger={
                          <Image inline size ='medium'
                             bordered
                             src={`/files/${this.props.url}`}/>
                         }>
                        <Modal.Content image>
                          <Image centered src={`/files/${this.props.url}`} />
                        </Modal.Content>
                        <Modal.Actions>
                          <a href={`/api/download/${this.props.types}/${this.props.url}/${this.props.contents}`} download>저장하기</a>
                        </Modal.Actions>
                      </Modal>
                        <a href={`/api/download/${this.props.types}/${this.props.url}/${this.props.contents}`} download><Icon size='large' name='download' link /></a>
                      </Segment>;
    const lastDateMessage = this.props.lastDateID === this.props.id?<Divider horizontal >마지막 접속일 {moment(localStorage.getItem('lastAccess')).format('MMMM Do YYYY, h:mm:ss a')} 이후 메시지.</Divider>:null;
    const unReadMessage = this.props.isReceived&&!lastDateMessage?<Divider horizontal>여기까지 읽으셨습니다.</Divider>:null;
    return(
      <div ref = {ref => this.message = ref}>
        <div ref = {ref => this.unReadMessage = ref}>
        {unReadMessage}
        {lastDateMessage}
        </div>
        <div className={waitingStyle}>
          <div className={styles.messageImg}>
            <img className={styles.messageImg}
              ref={img => this.img = img}
              src={`/assets/images/users/${this.props.userName}.png`}
              onError={ () => this.img.src = '/assets/images/users/basic/profile1.png'}/>
          </div>
          <div className={styles.messageContents}>
            <Popup
              key={this.props.userName}
              hoverable
              flowing
              hideOnScroll
              on='click'
              trigger={<span style={{'fontWeight':'bold'}}>{this.props.userName}</span>}>
              {myMessage}
            </Popup>
            <span className='grey-text' style={{'fontStyle':'italic','fontSize':10}}> ..{moment(this.props.created).fromNow()}</span>
            {contents}
          </div>
        </div>
      </div>
    );
  }
}
Message.defaultProps = {
  id: '',
  userName : '',
  created : moment().format(),
  contents : '',
  addGroup : () => {console.log('Add Group Error');},
  currentUser : '',
  isWaiting : false,
  types : 'message',
  url : '',
  messageJumpID: '',
};
Message.propTypes = {
  id : PropTypes.string.isRequired,
  userName : PropTypes.string.isRequired,
  created : PropTypes.string.isRequired,
  contents : PropTypes.string.isRequired,
  addGroup : PropTypes.func.isRequired,
  currentUser : PropTypes.string.isRequired,
  isWaiting : PropTypes.bool.isRequired,
  types : PropTypes.string.isRequired,
  url : PropTypes.string.isRequired,
  isReceived : PropTypes.bool.isRequired,
  scrollIntoReceive : PropTypes.func.isRequired,
  scrollIntoDate :PropTypes.func.isRequired,
  scrollIntoJump: PropTypes.func.isRequired,
  lastDateID : PropTypes.string.isRequired,
  messageJumpID : PropTypes.string.isRequired,
};
export default Message;
