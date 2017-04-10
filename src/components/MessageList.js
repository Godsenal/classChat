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
    if(messagesContainer){
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  handleScroll(){
    const messagesContainer = this.messagesContainer;
    if(messagesContainer){
      if(messagesContainer.scrollHeight - messagesContainer.scrollTop > messagesContainer.offsetHeight * 2){
        this.setState({isBottom: false});
      }
      else{
        this.setState({isBottom: true});
      }
      if((!this.props.isLast)&&(messagesContainer.scrollTop == 0) && (!this.isLoading)){
        this.isLoading = true;
        this.height = messagesContainer.scrollHeight;
        this.top = messagesContainer.scrollTop;
        this.props.setInitial(false);

        this.props.listMessage(this.props.activeChannel.id,false,this.props.messages[0].id)
          .then(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight - (this.height - this.top);
            this.isLoading = false;
          })
          .catch(()=>{
            console.log('old Message load Failure');
          });
      }
    }
  }
  handleDownClick = () => {
    this.scrollToBottom();
    this.setState({isBottom: true});
  }
  scrollIntoView = (domNode) => {
    //domNode.scrollIntoView(true);
    if(domNode){
      if(this.isReceived !== 'DONE'  && (this.isLastDate !== 'DONE')){
        this.isReceived = 'DONE';
        domNode.scrollIntoView(false);
        this.props.deleteReceiveMessage(this.props.activeChannel.id);
      }
    }
  }
  scrollIntoDate = (domNode) => {
    if(domNode){
      if(this.isLastDate !== 'DONE'){
        this.isLastDate = 'DONE';
        domNode.scrollIntoView(false);
        this.props.deleteLastDateID(this.props.activeChannel.id);
      }
    }
  }
  componentDidMount() { //채널 처음 들어왔을 때.
    this.isLoading = false;
    this.isReceived = 'INIT';
    if(this.isLastDate !== 'DONE')
      this.scrollToBottom();
  }
  componentDidUpdate(prevProps) {//다른 채널 들어갈 때 && 들어왔던 채널에 들어올때

    const messagesContainer = this.messagesContainer;
    if(messagesContainer){
      if(prevProps.messages !== this.props.messages){
        if(prevProps.messageReceive.message !== this.props.messageReceive.message && (messagesContainer.scrollHeight - messagesContainer.scrollTop > this.messagesContainer.offsetHeight * 2)){
          this.addNotification();
        }else if(!this.isLoading && (this.isReceived !== 'DONE') && (this.isLastDate !== 'DONE') ){/*&& !isReceived*/
          this.scrollToBottom();
        }
      }
      if(prevProps.activeChannel.id !== this.props.activeChannel.id){ //채널이 바뀔 때 이건 INIT해줘야함. 이렇게함으로써 메시지 add할 때 scrollbottom 가능.
        this.isReceived = 'INIT';
        this.isLastDate = 'INIT';
      }
    }
    /*if(isReceived){
      this.props.deleteReceiveMessage(this.props.activeChannel.id);
    }*/
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
            <DateMessage key={message.id}
                         currentUser={this.props.currentUser}
                         addGroup={this.props.addGroup}
                         receivedMessage={this.props.activeChannel.id in this.props.messageReceive?this.props.messageReceive[this.props.activeChannel.id].shift():{}}
                         lastDateID={this.props.lastDateID}
                         scrollIntoView={this.scrollIntoView}
                         scrollIntoDate={this.scrollIntoDate}
                         {...message} />
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
  lastDateID: '',
};
MessageList.propTypes = {
  isMobile : PropTypes.bool.isRequired,
  messages : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
  messageListStatus : PropTypes.string.isRequired,
  messageAddStatus : PropTypes.string.isRequired,
  messageReceive : PropTypes.object.isRequired,
  deleteReceiveMessage : PropTypes.func.isRequired,
  deleteLastDateID : PropTypes.func.isRequired,
  isLast : PropTypes.bool.isRequired,
  lastDateID : PropTypes.string.isRequired,
  setInitial : PropTypes.func.isRequired,
  listMessage : PropTypes.func.isRequired,
  activeChannel: PropTypes.object.isRequired,
  addGroup : PropTypes.func.isRequired,
};
export default MessageList;
