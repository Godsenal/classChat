import React,{Component, PropTypes} from 'react';
import {Icon, Dimmer, Loader, Segment} from 'semantic-ui-react';
import moment from 'moment';
import NotificationSystem from 'react-notification-system';
import {DateMessage} from './';
import styles from '../Style.css';


class MessageList extends Component {
  constructor(){
    super();
    this.state = {
      newMessage : false,
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  addNotification() {
    this.notificationSystem.addNotification({
      children:(
        <div className={styles.flexMessage}>
          <div className={styles.messageImg}>
            <img className={styles.messageImg} src='https://semantic-ui.com/images/avatar/small/matt.jpg'/>
          </div>
          <div className={styles.messageContents}>
            <span style={{'fontWeight':'bold'}}>{this.props.messageReceive.message.userName}</span>
            <span className='grey-text' style={{'fontStyle':'italic','fontSize':10}}> ..{moment(this.props.messageReceive.message.created).format('MMMM Do YYYY, h:mm:ss a')}</span>
            <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}>{this.props.messageReceive.message.contents}</p>
          </div>
        </div>
      ),
      level: 'info',
      position: 'br',
    });
  }
  scrollToBottom = () => {
    const messagesContainer = this.messagesContainer;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  };
  handleScroll(){
    if((!this.props.isLast)&&(this.messagesContainer.scrollTop <= 50) && (!this.isLoading)){
      this.isLoading = true;
      this.height = this.messagesContainer.scrollHeight;
      this.top = this.messagesContainer.scrollTop;
      this.props.setInitial(false);
      this.props.listMessage(this.props.activeChannel.id,false,this.props.messages[0].id)
        .then(() => {
          this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight - (this.height - this.top);
          this.isLoading = false;
        })
        .catch(()=>{
          console.log('old Message load Failure');
        });
    }
  }
  componentDidMount() {
    this.isLoading = false;
    this.scrollToBottom();


  }
  componentDidUpdate(prevProps) {
    if(prevProps.messages !== this.props.messages){
      if((prevProps.messageReceive !== this.props.messageReceive)&&(this.messagesContainer.scrollTop < this.messagesContainer.scrollHeight - this.messagesContainer.clientHeight * 2 ) ){
        this.addNotification();
      }else if(!this.isLoading){
        this.scrollToBottom();
      }
    }
  }
  render () {
    const mobileStyle = this.props.isMobile?styles.messageListContainerMobile:styles.messageListContainer;
    const isEmpty = (this.props.messages.length === 0 ? true : false);
    const messageList = ( isEmpty ?
      <div className={styles.emptyChat}>
        <h1>
          <Icon size='huge' name='comments outline' /><br/>아직 메시지가 없습니다.<br/>
        </h1>
        <h2>새 메시지를 남겨보세요!</h2>
      </div>
        :
        this.props.messages.map((message) => {
          return (
            <DateMessage key={message.id} currentUser={this.props.currentUser} {...message} />
          );
        }));
    const loadingView = ( this.isLoading === true ?
                          <Segment>
                            <Dimmer active>
                              <Loader>Loading</Loader>
                            </Dimmer>
                          </Segment>
                          :((isEmpty||this.props.isLast)?null
                          :<Segment>
                            <Dimmer active>
                              Old Messages
                            </Dimmer>
                          </Segment>
                          ));
    return(
      <div className={mobileStyle} ref={(ref) => {this.messagesContainer = ref;}} onScroll={this.handleScroll}>
        {loadingView}
        {messageList}
        <NotificationSystem ref={ref => this.notificationSystem = ref} />
      </div>
    );
  }
}

MessageList.propTypes = {
  isMobile : PropTypes.bool.isRequired,
  messages : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
  messageListStatus : PropTypes.string.isRequired,
  messageAddStatus : PropTypes.string.isRequired,
  messageReceive : PropTypes.object.isRequired,
  isLast : PropTypes.bool.isRequired,
  setInitial : PropTypes.func.isRequired,
  listMessage : PropTypes.func.isRequired,
  activeChannel: PropTypes.object.isRequired,
};
export default MessageList;
