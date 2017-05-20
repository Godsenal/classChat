import React, { Component, PropTypes } from 'react';
import {Dimmer, Loader,  Segment, Sidebar} from 'semantic-ui-react';


import {MessageList, ChatHeader, InputMessage, SearchSidebar} from '../components';
import styles from '../Style.css';



class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      isSearch : false,
      isInitial : true,
    };
    this.setInitial = this.setInitial.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.activeChannel !== nextProps.activeChannel)
      this.setState({isInitial : true, isSearch : false});
  }
  setInitial(isInitial){
    this.setState({
      isInitial,
    });
  }
  toggleSearch = () => {
    this.props.resetFilter();
    this.setState({
      isSearch : !this.state.isSearch,
    });
  }
  //왜인지 모르겠지만 e.target.name을 받아올때도 있고 못받아올때도 있음.
  handleFilterApp = (e) => {
    this.props.filterMessage(this.props.activeChannel.id, 'application');
  }
  handleFilterImg = (e) => {
    this.props.filterMessage(this.props.activeChannel.id, 'image');
  }
  // div 바로 다음. <ChannelList channels={this.props.channels} changeActiveChannel={this.changeActiveChannel} />
  render(){
    const {isSearch} = this.state;
    const loaderStyle = this.props.isMobile?styles.messageLoaderMobile:styles.messageLoader;
    const mobileHeight = this.props.isMobile?this.props.screenHeight-60:this.props.screenHeight;
    const loadingView =
            <Segment basic className={loaderStyle}>
              <Dimmer active inverted>
                <Loader indeterminate >Preparing Messages</Loader>
              </Dimmer>
            </Segment>;
    const chatView = this.props.activeChannel.id in this.props.list?
            <div className={styles.chatBody} style={{'height':mobileHeight+'px'}}>
              <ChatHeader {...this.props.activeChannel}
                          isSearch={this.state.isSearch}
                          toggleSearch={this.toggleSearch}
                          leaveChannel={this.props.leaveChannel}
                          currentUser={this.props.currentUser}/>
              <div className={styles.messageBody}>
                <MessageList isMobile={this.props.isMobile}
                             screenHeight={mobileHeight}
                             listMessage={this.props.listMessage}
                             deleteReceiveMessage={this.props.deleteReceiveMessage}
                             deleteLastDateID={this.props.deleteLastDateID}
                             activeChannel={this.props.activeChannel}
                             messages={this.props.list[this.props.activeChannel.id].messages}
                             messageAddStatus={this.props.messageAddStatus}
                             messageReceive={this.props.messageReceive}
                             messageListStatus={this.props.messageListStatus}
                             isLast={this.props.list[this.props.activeChannel.id].isLast}
                             lastDateID={this.props.list[this.props.activeChannel.id].lastDateID}
                             currentUser={this.props.currentUser}
                             setInitial={this.setInitial}
                             addGroup={this.props.addGroup}/>
              </div>
              <div className={styles.inputBody}>
                <InputMessage addMessage={this.props.addMessage}
                              toggleSearch={this.toggleSearch}
                              handleMention={this.props.handleMention}
                              addGroup={this.props.addGroup}
                              activeChannel={this.props.activeChannel}
                              currentUser={this.props.currentUser}/>
              </div>
            </div>:null;

    const view = ((this.props.messageListStatus !== 'SUCCESS')&&(this.state.isInitial))?loadingView:chatView;
    return(
      <Sidebar.Pushable as='div' style={{'height':mobileHeight+'px', 'overflow':'hidden'}}>
        <SearchSidebar toggleSearch={this.toggleSearch}
                       isSearch={isSearch}
                       currentUser={this.props.currentUser}
                       activeChannel={this.props.activeChannel}
                       filterMessage={this.props.filterMessage}
                       messageFilter={this.props.messageFilter}/>
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
  filterMessage : () => {console.log('ChatView props Error');},
  resetFilter : () => {console.log('ChatView props Error');},
  messageFilter: {},
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
  resetFilter: PropTypes.func.isRequired,
  messageFilter: PropTypes.object.isRequired,
  filterMessage : PropTypes.func.isRequired,
};
export default ChatView;
