import React, { Component, PropTypes } from 'react'
import {Form, Button, Icon, Dimmer, Loader, Image, Segment } from 'semantic-ui-react';


import {MessageList, ChatHeader, InputMessage} from '../components';
import styles from '../Style.css';

class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      isInitial : true,
    };
    this.changeActiveChannel = this.changeActiveChannel.bind(this);
    this.setInitial = this.setInitial.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.activeChannel !== nextProps.activeChannel)
      this.setState({isInitial : true});
  }
  changeActiveChannel(channel) {
    socket.emit('leave channel', this.props.activeChannel);
    socket.emit('join channel', channel);
    this.props.changeChannel(channel);
    this.props.listMessage(channel.id, true);
  }
  addMessage(message){
    this.props.addMessage(message);
  }
  setInitial(isInitial){
    this.setState({
      isInitial,
    });
  }
  // div 바로 다음. <ChannelList channels={this.props.channels} changeActiveChannel={this.changeActiveChannel} />
  render(){
    const loadingView =
            <Segment basic className={styles.messageLoader}>
              <Dimmer active inverted>
                <Loader indeterminate >Preparing Messages</Loader>
              </Dimmer>
            </Segment>;
    const chatView =
            <div>
              <ChatHeader {...this.props.activeChannel} leaveChannel={this.props.leaveChannel}/>
              <MessageList isMobile={this.props.isMobile}
                           listMessage={this.props.listMessage}
                           activeChannel={this.props.activeChannel}
                           messages={this.props.messages}
                           messageAddStatus={this.props.messageAddStatus}
                           messageReceive={this.props.messageReceive}
                           messageListStatus={this.props.messageListStatus}
                           isLast={this.props.isLast}
                           currentUser={this.props.currentUser}
                           setInitial={this.setInitial}
                           addGroup={this.props.addGroup}/>
              <InputMessage addMessage={this.addMessage} addGroup={this.props.addGroup} activeChannel={this.props.activeChannel} currentUser={this.props.currentUser}/>
            </div>;
    const view = ((this.props.messageListStatus !== 'SUCCESS')&&(this.state.isInitial))?loadingView:chatView;
    return(
      <div>
        {view}
      </div>
    );
  }
}


export default ChatView;
