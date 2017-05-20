import React, { Component, PropTypes } from 'react';
import {Sidebar, Segment, Dropdown, Menu, Icon,} from 'semantic-ui-react';

import {FilterDateMessage,} from './';
import styles from '../Style.css';

const searchOption = [
  { key: 'message', text: '내용', value: 'message' },
  { key: 'userName', text: '작성자', value: 'userName' },
  { key: 'date', text: '날짜', value: 'date' },
  { key: 'application', text: '파일', value: 'application' },
  { key: 'image', text: '이미지', value: 'image' },
];

class SearchSidebar extends Component {
  constructor(){
    super();
    this.state = {
      selectOption : [],
      searchFilter: 'message',
      searchWord: '',
      isSearch: false,
    };
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
  render () {
    const {searchFilter, selectOption, searchWord} = this.state;
    const filterLoadingView = <Segment inverted attached='top' basic textAlign='center'><Icon size='huge' loading name='spinner' /></Segment>;
    const filterEmptyView = <Segment inverted attached='top' basic textAlign='center'><Icon size='huge' name='terminal' />검색 결과가 없습니다.</Segment>;
    const filterView = this.props.messageFilter.status === 'INIT'?null:
            this.props.messageFilter.status==='SUCCESS' && this.props.messageFilter.messages.length===0?filterEmptyView:
            this.props.messageFilter.status==='WAITING'&&!this.isMore?filterLoadingView:
            this.props.messageFilter.messages.length!==0? // length 가 0 이 아닐 때는 원래있던거 보여줌.Lazy list하기 위해서.
            this.props.messageFilter.messages.map((message) => {
              return <FilterDateMessage key={message.id} {...message} currentUser={this.props.currentUser} />;}):null;

    return(
      <Sidebar as={Segment} style={{'background':'#EFECCA'}} compact animation='overlay' direction='right' width='very wide' visible={this.props.isSearch} icon='labeled'>
        <Menu attached='top' style={{'height':'10%'}}>
          <Menu.Item name='닫기' onClick={this.props.toggleSearch}/>
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

    );
  }
}

SearchSidebar.defaultProps = {
  messageFilter: {},
  filterMessage: ()=>{console.log('SearchSidebar props error');},
  activeChannel: {},
  currentUser: '',
  toggleSearch: ()=>{console.log('SearchSidebar props error');},
  isSearch: false,
};
SearchSidebar.propTypes = {
  messageFilter: PropTypes.object.isRequired,
  filterMessage : PropTypes.func.isRequired,
  activeChannel : PropTypes.object.isRequired,
  currentUser : PropTypes.string.isRequired,
  toggleSearch : PropTypes.func.isRequired,
  isSearch : PropTypes.bool.isRequired,
};
export default SearchSidebar;
