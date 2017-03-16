import React,{Component, PropTypes} from 'react';
import {Icon, } from 'semantic-ui-react';
import {Message} from './';
import styles from '../Style.css';

class MessageList extends Component {
  constructor(){
    super();
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  scrollToBottom = () => {
    const messagesContainer = this.refs.messagesContainer;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  };
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate(prevProps) { // scroll to bottom when new message has come.
     //scrollTop 이 0일 때가 scroll이 맨 위로 도달했을 떄! 이거 이용해서 lazy list 하자.

    if(prevProps.messages !== this.props.messages){
      this.scrollToBottom();
    }
  }
  render () {
    const mobileStyle = this.props.isMobile?styles.messageListContainerMobile:styles.messageListContainer;
    const messageList = (((this.props.messageListStatus !== ('INIT'||'WAITING'))&&( this.props.messages.length === 0 ))?
      <div className={styles.emptyChat}>
        <h1>
          <Icon size='huge' name='comments outline' /><br/>아직 메시지가 없습니다.<br/>
        </h1>
        <h2>새 메시지를 남겨보세요!</h2>
      </div>
        :this.props.messages.map((message) => {
          return <Message key={message.id} currentUser={this.props.currentUser} {...message} />;
        }));
    return(
      <div className={mobileStyle}  ref='messagesContainer'>
        {messageList}
      </div>
    );
  }
}

MessageList.propTypes = {
  isMobile : PropTypes.bool.isRequired,
  messages : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
  messageListStatus : PropTypes.string.isRequired,
};
export default MessageList;
