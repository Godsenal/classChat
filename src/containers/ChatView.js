import React, { Component, PropTypes } from 'react';
import {Dimmer, Loader,  Segment, Sidebar, Button, Dropdown, Menu, Icon, Input } from 'semantic-ui-react';


import {MessageList, ChatHeader, InputMessage, FilterDateMessage} from '../components';
import styles from '../Style.css';

class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      isInitial : true,
      menu : false,
      filter : '',
    };
    this.setInitial = this.setInitial.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.activeChannel !== nextProps.activeChannel)
      this.setState({isInitial : true});
  }
  addMessage(message){
    this.props.addMessage(message);
  }
  setInitial(isInitial){
    this.setState({
      isInitial,
    });
  }
  toggleMenu = () => {
    this.setState({
      menu: !this.state.menu,
    });
  }
  handleFilter = (e) => {
    this.props.filterMessage(this.props.activeChannel.id, e.target.id);
    this.setState({filter: e.target.id});
  }
  // div 바로 다음. <ChannelList channels={this.props.channels} changeActiveChannel={this.changeActiveChannel} />
  render(){
    const loaderStyle = this.props.isMobile?styles.messageLoaderMobile:styles.messageLoader;
    const loadingView =
            <Segment basic className={loaderStyle}>
              <Dimmer active inverted>
                <Loader indeterminate >Preparing Messages</Loader>
              </Dimmer>
            </Segment>;
    const chatView =
            <div>
              <ChatHeader {...this.props.activeChannel} toggleMenu={this.toggleMenu} leaveChannel={this.props.leaveChannel} currentUser={this.props.currentUser}/>
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
      <Sidebar.Pushable as='div'>
        <Sidebar as={Segment} animation='overlay' direction='right' width='wide' visible={this.state.menu} style={{'background':'#B3B2AD'}} icon='labeled' vertical inverted>
          <Menu fixed='top'>
            <Menu.Item name='닫기' onClick={this.toggleMenu}/>
            <Dropdown item icon='filter' simple>
              <Dropdown.Menu>
                <Dropdown.Item icon='file' text='File' id='application' onClick={this.handleFilter}/>
                <Dropdown.Item icon='image' text='Image' id='image' onClick={this.handleFilter}/>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>
              <Input className='icon' icon='search' placeholder='Search...' />
            </Menu.Item>
          </Menu>
          {this.props.messageFilter.status === 'SUCCESS'&&this.props.messageFilter.messages.map((message) => {
            return <FilterDateMessage key={message.id} {...message} currentUser={this.props.currentUser} />;
          })}
        </Sidebar>
        <Sidebar.Pusher>
          {view}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
ChatView.defaultProps = {
  isMobile : false,
  currentUser : '',
  activeChannel : {},
  changeChannel : () => {console.log('ChatView props Error');},
  leaveChannel : () => {console.log('ChatView props Error');},
  addGroupp : () => {console.log('ChatView props Error');},
  messages : [],
  messageReceive : {},
  messageAddStatus : 'INIT',
  messageListStatus : 'INIT',
  isLast : false,
  listMessage : () => {console.log('ChatView props Error');},
  addMessage : () => {console.log('ChatView props Error');},
};
ChatView.propTypes = {
  isMobile : PropTypes.bool.isRequired,
  currentUser : PropTypes.string.isRequired,
  activeChannel : PropTypes.object.isRequired,
  changeChannel : PropTypes.func.isRequired,
  leaveChannel : PropTypes.func.isRequired,
  addGroup : PropTypes.func.isRequired,
  messages : PropTypes.array.isRequired,
  messageReceive : PropTypes.object.isRequired,
  messageAddStatus : PropTypes.string.isRequired,
  messageListStatus : PropTypes.string.isRequired,
  isLast : PropTypes.bool.isRequired,
  listMessage : PropTypes.func.isRequired,
  addMessage : PropTypes.func.isRequired,
};
export default ChatView;
