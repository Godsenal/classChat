import React, { Component, PropTypes } from 'react';
import {Dimmer, Loader,  Segment, Sidebar, Button, Dropdown, Menu, Icon, Input } from 'semantic-ui-react';
import moment from 'moment';

import {MessageList, ChatHeader, InputMessage, FilterDateMessage} from '../components';
import styles from '../Style.css';

const searchOption = [
  { key: 'message', text: '내용', value: 'message' },
  { key: 'userName', text: '작성자', value: 'userName' },
  { key: 'date', text: '날짜', value: 'date' },
  { key: 'application', text: '파일', value: 'application' },
  { key: 'image', text: '이미지', value: 'image' },
];

class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      isSearch : false,
      isInitial : true,
      selectOption : [],
      searchFilter: 'message',
      searchWord: '',
    };
    this.setInitial = this.setInitial.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.activeChannel !== nextProps.activeChannel)
      this.setState({isInitial : true, isSearch : false});

    if(this.state.selectOption!== nextProps.activeChannel.participants){
      this.setState({
        selectOption : nextProps.activeChannel.participants.map((participant, index) => {
          var option = {key : index, value : participant, text : participant};
          return option;
        }),
      });
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
  handleFilterApp = (e) => {
    this.props.filterMessage(this.props.activeChannel.id, 'application');
  }
  handleFilterImg = (e) => {
    this.props.filterMessage(this.props.activeChannel.id, 'image');
  }
  handleSearchFilter = (e,filter) => {
    this.setState({
      searchFilter: filter.value,
      searchWord: '',
    });
  }
  handleSearchKeyDown = (e) => {
    if(this.state.searchWord === 0 || !this.state.searchWord.trim()){
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.isMore = false;
      this.props.filterMessage(this.props.activeChannel.id, this.state.searchFilter,'-1',this.state.searchWord.trim());
    }
  }
  handleSearchMore = () => {
    //마지막이 아닐 때, filter state에 저장되어 있는 대로(마지막 검색 결과) 그 위부터 다시 검색.
    if(!this.props.messageFilter.isLast){
      this.isMore = true;
      this.props.filterMessage(this.props.activeChannel.id, this.props.messageFilter.types,this.props.messageFilter.messages[0].id,this.props.messageFilter.searchWord);
    }

  }
  handleChange = (e, dropdown) => {
    if(dropdown){
      this.isMore = false;
      this.props.filterMessage(this.props.activeChannel.id, 'userName','-1',dropdown.value);
    }
    else{
      this.setState({[`${e.target.name}`]: e.target.value});
    }


  }
  // div 바로 다음. <ChannelList channels={this.props.channels} changeActiveChannel={this.changeActiveChannel} />
  render(){
    const {isSearch, searchFilter, selectOption, searchWord} = this.state;
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
    // Lazy List를 잘 표현하기 위한 작업
    const filterLoadingView = <Segment inverted attached='top' basic textAlign='center'><Icon size='huge' loading name='spinner' /></Segment>;
    const filterEmptyView = <Segment inverted attached='top' basic textAlign='center'><Icon size='huge' name='terminal' />검색 결과가 없습니다.</Segment>;
    const filterView = this.props.messageFilter.status === 'INIT'?null:
            this.props.messageFilter.status==='SUCCESS' && this.props.messageFilter.messages.length===0?filterEmptyView:
            this.props.messageFilter.status==='WAITING'&&!this.isMore?filterLoadingView:
            this.props.messageFilter.messages.length!==0? // length 가 0 이 아닐 때는 원래있던거 보여줌.Lazy list하기 위해서.
            this.props.messageFilter.messages.map((message) => {
              return <FilterDateMessage key={message.id} {...message} currentUser={this.props.currentUser} />;}):null;

    const view = ((this.props.messageListStatus !== 'SUCCESS')&&(this.state.isInitial))?loadingView:chatView;
    return(
      <Sidebar.Pushable as='div' style={{'height':mobileHeight+'px', 'overflow':'hidden'}}>
        <Sidebar as={Segment} style={{'background':'#EFECCA'}} compact animation='overlay' direction='right' width='very wide' visible={isSearch} icon='labeled'>
            <Menu attached='top' style={{'height':'10%'}}>
              <Menu.Item name='닫기' onClick={this.toggleSearch}/>
              <Menu.Item>
                <Dropdown  placeholder='검색 카테고리' labeled options={searchOption} defaultValue='message' onChange={this.handleSearchFilter}/>
              </Menu.Item>
              <Menu.Item>
                {searchFilter=='userName'?
                  <Dropdown  className={styles.searchInput} placeholder='유저명' labeled search selection options={selectOption} name='search' onChange={this.handleChange}/>:
                  searchFilter=='date'?
                  <input  type='date' className={styles.searchInput} name='searchWord' value={searchWord} onChange={this.handleChange} onKeyDown={this.handleSearchKeyDown}/>:
                  <input  ref={input => this.textInput = input} className={styles.searchInput} name='searchWord' value={searchWord} onChange={this.handleChange} onKeyDown={this.handleSearchKeyDown}/>}
              </Menu.Item>
            </Menu>
            {filterView?
              <div style={{'overflowY':'auto', 'overflowX':'hidden','height':'90%'}}>
                {this.props.messageFilter.isLast?null:
                  this.props.messageFilter.status==='WAITING'&&this.isMore?
                  <Segment secondary basic attached textAlign='center'>
                    <Icon size='huge' loading name='spinner' />
                  </Segment>
                :<Segment style={{'cursor': 'pointer'}} secondary basic attached textAlign='center' onClick={this.handleSearchMore}>
                  더 가져오기
                 </Segment>}
                {filterView}
              </div>:null}
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
};
export default ChatView;
