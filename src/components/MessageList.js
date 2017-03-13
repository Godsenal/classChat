import React,{Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Item} from 'semantic-ui-react';
import {Message} from './';

class MessageList extends Component {
  constructor(){
    super();
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  scrollToBottom = () => {
    const messagesContainer = ReactDOM.findDOMNode(this.messagesContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps!==prevState)
      this.scrollToBottom();
  }
  render () {
    return(
      <div style={{'height':'80vh','overflowY':'auto', 'overflowX':'hidden'}}  >
        {this.props.messages.map((message) => {
          return <Message key={message.id} ref={(el) => { this.messagesContainer = el; }} currentUser={this.props.currentUser} {...message} />;
        })}
      </div>
    );
  }
}

MessageList.propTypes = {
  messages : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
};
export default MessageList;
