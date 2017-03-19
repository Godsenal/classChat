import React,{Component, PropTypes} from 'react';
import {Icon, } from 'semantic-ui-react';
import moment from 'moment';
import {DateMessage, Message} from './';
import styles from '../Style.css';
import _ from 'lodash';

class MessageList extends Component {
  constructor(){
    super();
    this.state = {
      dateMessages : [],
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  scrollToBottom = () => {
    const messagesContainer = this.refs.messagesContainer;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  };
  setHoursZero = (date) => {
    if(date)
      date.setHours(0,0,0,0);
    return date;
  }
  componentDidMount() {
    this.scrollToBottom();
  }/*
  componentWillMount(){
    var divByDate = [];
    var divided = {};
    this.props.messages.map((message) => {

      if(divided.date!==new Date(message.created).setHours(0,0,0,0)){
        divByDate.push(divided);
        divided = {};       }

      if(_.isEmpty(divided)){
        divided = {
          date : new Date(message.created).setHours(0,0,0,0),
          messages : [message]
        };
      }
      else{
        divided.messages.push(message);
      }
    });
    this.setState({
      dateMessages : divByDate
    });
  }*/
  componentDidUpdate(prevProps) { // scroll to bottom when new message has come.
     //scrollTop 이 0일 때가 scroll이 맨 위로 도달했을 떄! 이거 이용해서 lazy list 하자.
    const messagesContainer = this.refs.messagesContainer;
    // message가 0이 아닐때.
    if(messagesContainer.scrollTop <= 50){
      console.log(this.props.messages[0].id);
      this.props.listMessage(this.props.activeChannel.id,false,this.props.messages[0].id)
        .then(() => {
        });
    }
    if(prevProps.messages !== this.props.messages){
      this.scrollToBottom();
    }
  }
  render () {
    const mobileStyle = this.props.isMobile?styles.messageListContainerMobile:styles.messageListContainer;
    const messageList = ( this.props.messages.length === 0 ?
      <div className={styles.emptyChat}>
        <h1>
          <Icon size='huge' name='comments outline' /><br/>아직 메시지가 없습니다.<br/>
        </h1>
        <h2>새 메시지를 남겨보세요!</h2>
      </div>
        :this.props.messages.map((message) => {
          return (
            <DateMessage key={message.id} ref={message.id} currentUser={this.props.currentUser} {...message} />
          );
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
