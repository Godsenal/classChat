import React, { Component, PropTypes } from 'react'
import {Form, Button, Icon, Dimmer, Loader, Image } from 'semantic-ui-react';


import {MessageList, ChatHeader} from '../components';
import styles from '../Style.css';

class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      message : '',
    };
    this.addMessage = this.addMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeActiveChannel = this.changeActiveChannel.bind(this);
  }
  changeActiveChannel(channel) {
    socket.emit('leave channel', this.props.activeChannel);
    socket.emit('join channel', channel);
    this.props.changeChannel(channel);
    this.props.listMessage(channel.id);
  }
  addMessage(){
    this.props.addMessage(this.state.message);
    this.setState({message: ''});
  }
  handleChange(e){
    this.setState({
      message : e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.addMessage();
    }
  }
  // div 바로 다음. <ChannelList channels={this.props.channels} changeActiveChannel={this.changeActiveChannel} />
  render(){
    const loadingView = (((this.props.messageListStatus)===('WAITING'||'INIT'))?
      <Dimmer active >
        <Loader indeterminate>Preparing Messages</Loader>
      </Dimmer>:<div><ChatHeader {...this.props.activeChannel} />
      <MessageList isMobile={this.props.isMobile} messages={this.props.messages} currentUser={this.props.currentUser} messageListStatus={this.props.messageListStatus}/>
      <div className={styles.messageInputContainer}>
        <Button className={styles.messageInputButton} icon>
          <Icon name='plus' />
        </Button>
        <textArea className={styles.messageInput} type ='text' value={this.state.message} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
      </div></div>);

    return(
      <div>
        {loadingView}
      </div>
    );
  }
}


export default ChatView;
