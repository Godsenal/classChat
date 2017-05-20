import React,{Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Popup, Button, Image, Icon,  Segment, Divider } from 'semantic-ui-react';
import moment from 'moment';
import styles from '../Style.css';

class Message extends Component {
  constructor(){
    super();
    this.state = {
      imageStatus : 'loading',
      hiddenImage : true,
      isReceived : false,
      isLastDate : false,
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
        this.props.scrollIntoView(messageNode);
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
    const myMessage = (this.props.currentUser === this.props.userName)?
      <div>HI {this.props.currentUser}</div>
      :<Button onClick={ () => this.handleAddGroup(this.props.userName)}>1:1 채팅하기</Button>;
    const waitingStyle =  !this.props.isWaiting?styles.flexMessage:styles.flexMessageWaiting;
    const contents = this.props.types === 'message'?
                    <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}>{this.props.contents}</p>
                    :this.props.types === 'application'?<a href={`/api/download/${this.props.types}/${this.props.url}/${this.props.contents}`} download>
                      <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}><Icon name='file' size='huge' />{this.props.contents}</p></a>
                      :<Segment basic compact>
                        {this.state.hiddenImage&&<Button onClick={this.handleToggleImage}>이미지 보기</Button>}
                        <Image size ='medium'
                               hidden={this.state.hiddenImage}
                               bordered
                               as='a'
                               href={`/image/${this.props.url}/${this.props.contents}`}
                               target='_blank'
                               src={`/files/${this.props.url}`}/>
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
            <img className={styles.messageImg} src='https://semantic-ui.com/images/avatar/small/matt.jpg'/>
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
  scrollIntoView : PropTypes.func.isRequired,
  scrollIntoDate :PropTypes.func.isRequired,
  lastDateID : PropTypes.string.isRequired,
};
export default Message;
