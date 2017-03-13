import React,{Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Header, Icon} from 'semantic-ui-react';
import {Message} from './';

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
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render () {
    const messageList = ((this.props.messages.length === 0 )&& (this.props.messageListStatus !== ('WAITING'||'INIT'))?
      <Header textAlign='center' size='huge' as='h1' icon>
        <Icon name='frown' />
        아직 메시지가 없습니다.
        <Header.Subheader>
          새 메시지를 남겨보세요!
        </Header.Subheader>
      </Header>:this.props.messages.map((message) => {
        return <Message key={message.id} currentUser={this.props.currentUser} {...message} />;
      }));
    return(
      <div style={{'height':'80vh','overflowY':'auto', 'overflowX':'hidden'}}  ref='messagesContainer'>
        {messageList}
      </div>
    );
  }
}

MessageList.propTypes = {
  messages : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
};
export default MessageList;
