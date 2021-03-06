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
      targetID : '',
    };
    this.setInitial = this.setInitial.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.activeChannel !== nextProps.activeChannel){
      this.setState({isInitial : true, isSearch : false, targetID : ''});
    }
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
  handleFilterApp = () => {
    this.props.filterMessage(this.props.activeChannel.id, 'application');
  }
  handleFilterImg = () => {
    this.props.filterMessage(this.props.activeChannel.id, 'image');
  }
  handleJump = (targetID) => {
    var topMessageID = this.props.messageList[this.props.activeChannel.id].messages[0].messages[0].id;
    if(topMessageID <= targetID){
      this.setState({
        targetID
      });
    }
    else{
      this.props.jumpMessage(this.props.activeChannel.id,'id',topMessageID,targetID)
        .then(()=>{
          this.setState({
            targetID
          });
        });
    }
  }
  componentDidUpdate(prevProps, prevState){ // 같은 targetID로 이동할 때 messageList에서 update를 못하게 했으므로 다시 빈칸으로 바꿔줌.
    if(/\S/.test(this.state.targetID)){
      this.setState({
        targetID: '',
      });
    }
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
    const chatView = this.props.activeChannel.id in this.props.messageList?
            <div className={styles.chatBody} style={{'height':mobileHeight+'px'}}>
              <ChatHeader {...this.props.activeChannel}
                          isSearch={this.state.isSearch}
                          toggleSearch={this.toggleSearch}
                          leaveChannel={this.props.leaveChannel}
                          currentUser={this.props.currentUser}/>
              <div className={styles.messageBody}>
                <MessageList isMobile={this.props.isMobile}
                             screenHeight={mobileHeight}
                             messageJumpID={this.state.targetID}
                             listMessage={this.props.listMessage}
                             deleteReceiveMessage={this.props.deleteReceiveMessage}
                             deleteLastDateID={this.props.deleteLastDateID}
                             activeChannel={this.props.activeChannel}
                             messages={this.props.messageList[this.props.activeChannel.id].messages}
                             messageAddStatus={this.props.messageAddStatus}
                             messageReceive={this.props.messageReceive}
                             messageListStatus={this.props.messageListStatus}
                             isLast={this.props.messageList[this.props.activeChannel.id].isLast}
                             lastDateID={this.props.messageList[this.props.activeChannel.id].lastDateID}
                             currentUser={this.props.currentUser}
                             setInitial={this.setInitial}
                             addGroup={this.props.addGroup}/>
              </div>
              <div className={styles.inputBody}>
                <InputMessage addMessage={this.props.addMessage}
                              channels={this.props.channelList.channels}
                              toggleSearch={this.toggleSearch}
                              handleMention={this.props.handleMention}
                              inviteChannel={this.props.inviteChannel}
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
                       jumpMessage={this.handleJump}
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
  jumpMessage : () => {console.log('ChatView props Error');},
  resetFilter : () => {console.log('ChatView props Error');},
  messageFilter: {},
};
ChatView.propTypes = {
  isMobile : PropTypes.bool.isRequired,
  screenHeight : PropTypes.number.isRequired,
  currentUser : PropTypes.string.isRequired,
  activeChannel : PropTypes.object.isRequired,
  changeChannel : PropTypes.func.isRequired,
  leaveChannel : PropTypes.func.isRequired,
  addGroup : PropTypes.func.isRequired,
  messages : PropTypes.array.isRequired,
  messageReceive : PropTypes.object.isRequired,
  messageAddStatus : PropTypes.string.isRequired,
  messageList : PropTypes.object.isRequired,
  messageListStatus : PropTypes.string.isRequired,
  deleteReceiveMessage : PropTypes.func.isRequired,
  deleteLastDateID : PropTypes.func.isRequired,
  channelList : PropTypes.object.isRequired,
  handleMention : PropTypes.func.isRequired,
  inviteChannel : PropTypes.func.isRequired,
  isLast : PropTypes.bool.isRequired,
  listMessage : PropTypes.func.isRequired,
  addMessage : PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  messageFilter: PropTypes.object.isRequired,
  filterMessage : PropTypes.func.isRequired,
  jumpMessage : PropTypes.func.isRequired,
};
export default ChatView;
