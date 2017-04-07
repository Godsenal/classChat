import React,{Component, PropTypes} from 'react';
import {Icon, Dimmer, Loader, Segment, Button} from 'semantic-ui-react';
import moment from 'moment';
import NotificationSystem from 'react-notification-system';
import {DateMessage} from './';
import styles from '../Style.css';


class MessageList extends Component {
  constructor(){
    super();
    this.state = {
      newMessage : false,
      isBottom : true,
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
      onClick: this.scrollToBottom,
    });
  }
  scrollToBottom = () => {
    const messagesContainer = this.messagesContainer;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  };
  handleScroll(){
    if(this.messagesContainer.scrollHeight - this.messagesContainer.scrollTop > this.messagesContainer.offsetHeight * 2){
      this.setState({isBottom: false});
    }
    else{
      this.setState({isBottom: true});
    }
    if((!this.props.isLast)&&(this.messagesContainer.scrollTop == 0) && (!this.isLoading)){
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
  handleDownClick = () => {
    this.scrollToBottom();
    this.setState({isBottom: true});
  }
  componentDidMount() {
    this.isLoading = false;
    this.scrollToBottom();


  }
  componentDidUpdate(prevProps) {
    if(prevProps.messages !== this.props.messages){
      if((prevProps.messageReceive.message !== this.props.messageReceive.message)&&(this.messagesContainer.scrollTop < this.messagesContainer.scrollHeight - this.messagesContainer.clientHeight * 2 ) ){
        this.addNotification();
      }else if(!this.isLoading){
        this.scrollToBottom();
      }
    }
  }
  render () {
    const isEmpty = (this.props.messages.length === 0 ? true : false);
    const messageList = ( isEmpty ?
      <div className={styles.emptyChat} style={{'overflowY':'scroll', 'overflowX':'hidden', 'outline':0}}>
        <h1>
          <Icon size='huge' name='comments outline' /><br/>아직 메시지가 없습니다.<br/>
        </h1>
        <h2>새 메시지를 남겨보세요!</h2>
      </div>
        :
        this.props.messages.map((message) => {
          return (
            <DateMessage key={message.id} currentUser={this.props.currentUser} addGroup={this.props.addGroup} {...message} />
          );
        }));
    const loadingView = ( (this.isLoading === true)&&(!this.props.isLast) ?
                          <Segment className={styles.receiveOld} basic>
                            <Dimmer active inverted>
                              <Loader>Loading</Loader>
                            </Dimmer>
                          </Segment>
                          :((isEmpty||this.props.isLast)?null
                          :<div className={styles.receiveOld}>
                            <span className={styles.receiveOldText}>Get Old Messages</span>
                          </div>
                          ));
    const bottomBtn = !this.state.isBottom?
                      <Button
                        style={{'position': 'absolute','right':'10px','bottom':'5px' }}
                        onClick={this.handleDownClick}
                        circular
                        color='red'
                        icon='arrow down' />
                      :null;
    return(
      <div style={{'overflowY':'scroll', 'overflowX':'hidden', 'outline':0}} ref={(ref) => {this.messagesContainer = ref;}} onScroll={this.handleScroll}>
        {loadingView}
        {messageList}
        {bottomBtn}
        <NotificationSystem ref={ref => this.notificationSystem = ref} />
      </div>
    );
  }
}
MessageList.defaultProps = {
  messages: [],
};
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
  addGroup : PropTypes.func.isRequired,
};
export default MessageList;
