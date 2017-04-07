import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import {Menu, Dropdown, Icon, Segment, Loader, Dimmer, Label} from 'semantic-ui-react';

import styles from '../Style.css';


class Sidebar extends React.Component {
  constructor(){
    super();
    this.state = {
      activeItem :'',
      activeChannelItem :'1', // need to fix
    };
  }
  handleChannelClick = (channel) => {

    this.setState({
      activeChannelItem : channel.name,
    });
    this.props.changeActiveChannel(channel);
  }
  handleSearchClick = () => {
    this.props.handleSearchClick();
  }
  render () {
    const {activeChannel, messageReceive} = this.props;
    const loaderStyle = this.props.isMobile?styles.channelLoaderMobile:styles.channelLoader;
    const loadingView =
            <Segment basic inverted className={loaderStyle}>
              <Dimmer active inverted>
                <Loader indeterminate>Preparing Channels</Loader>
              </Dimmer>
            </Segment>;
    const responsiveView = (this.props.isMobile?
      <Menu attached inverted fluid widths={5}>
        <Dropdown className={styles.balooFont} item text={this.props.status.currentUser}>
          <Dropdown.Menu>
            <Dropdown.Item>My Profile</Dropdown.Item>
            <Dropdown.Item onClick={this.props.handleSignout}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={styles.balooFont} item text='Channel'>
          <Dropdown.Menu color='violet'>
            {this.props.channels.map((channel)=>{
              if(channel.type === 'CHANNEL')
                return(<Dropdown.Item name={channel.name}
                                      active={activeChannel.id === channel.id}
                                      key={channel.id}
                                      onClick={()=>this.handleChannelClick(channel)}>
                                      <Icon name='hashtag'/>{channel.name}</Dropdown.Item>);
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={styles.balooFont} item text='Group'>
          <Dropdown.Menu color='red'>
            {this.props.channels.map((channel)=>{
              if(channel.type === 'GROUP')
                return(<Dropdown.Item color='red'
                                      name={channel.name}
                                      active={activeChannel.id === channel.id}
                                      key={channel.id}
                                      onClick={()=>this.handleChannelClick(channel)}>
                                      <Icon name='group'/>{channel.name}</Dropdown.Item>);
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={styles.balooFont} item text='1:1'>
          <Dropdown.Menu color='blue'>
            {this.props.channels.map((channel)=>{
              var splitName = channel.name.split('+');
              var filterName = splitName.filter((name) => {
                return name !== this.props.status.currentUser;
              });
              var directName = filterName[0] + '님과의 채팅';
              if(channel.type === 'DIRECT')
                return(<Dropdown.Item color='blue'
                                      name={channel.name}
                                      active={activeChannel.id === channel.id}
                                      key={channel.id}
                                      onClick={()=>this.handleChannelClick(channel)}>
                                      <Icon name='group'/>{directName}</Dropdown.Item>);
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item className={styles.balooFont} name='search' onClick={this.handleSearchClick}>
          <Icon name='search'/>Search Channel
        </Menu.Item>
      </Menu>
        :
    <Menu style = {{'height':'100vh'}} vertical attached inverted>
      <Menu.Header >
        <Dropdown className={styles.balooFont} item text={this.props.status.currentUser}>
          <Dropdown.Menu>
            <Dropdown.Item>My Profile</Dropdown.Item>
            <Dropdown.Item onClick={this.props.handleSignout}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Header>
      <Menu.Item header className={styles.balooFont}>CHANNELS</Menu.Item>
        {this.props.channels.map((channel)=>{
          const label = channel.id in messageReceive && messageReceive[channel.id].length !== 0?
                        <Label color='teal'>{messageReceive[channel.id].length}</Label>:null;
          if(channel.type === 'CHANNEL'){
            return(<Menu.Item color='violet'
                              name={channel.name}
                              active={activeChannel.id === channel.id}
                              key={channel.id}
                              onClick={()=>this.handleChannelClick(channel)}>
                              {label}
                              <Icon name='hashtag'/>{channel.name}</Menu.Item>);}
        })}
      <Menu.Item header className={styles.balooFont}>GROUPS</Menu.Item>
        {this.props.channels.map((channel)=>{
          const label = channel.id in messageReceive && messageReceive[channel.id].length !== 0?
                        <Label color='teal'>{messageReceive[channel.id].length}</Label>:null;
          if(channel.type === 'GROUP'){
            return(<Menu.Item color='red'
                              name={channel.name}
                              active={activeChannel.id === channel.id}
                              key={channel.id}
                              onClick={()=>this.handleChannelClick(channel)}>
                              {label}
                              <Icon name='group'/>{channel.name}</Menu.Item>);}
        })}
      <Menu.Item header className={styles.balooFont}>1:1</Menu.Item>
        {this.props.channels.map((channel)=>{
          var splitName = channel.name.split('+');
          var filterName = splitName.filter((name) => {
            return name !== this.props.status.currentUser;
          });
          var directName = filterName[0] + '님과의 채팅';
          const label = channel.id in messageReceive && messageReceive[channel.id].length !== 0?
                        <Label color='teal'>{messageReceive[channel.id].length}</Label>:null;
          if(channel.type === 'DIRECT'){
            return(<Menu.Item color='blue'
                              name={channel.name}
                              active={activeChannel.id === channel.id}
                              key={channel.id}
                              onClick={()=>this.handleChannelClick(channel)}>
                              {label}
                              <Icon name='user'/>{directName}</Menu.Item>);}
        })}
      <Menu.Item className={styles.balooFont} name='search' onClick={this.handleSearchClick}>
        <Icon name='search'/>Search Channel
      </Menu.Item>
      <Menu.Item>
        <Link to ='/search' onClick={this.toggleSide}><span><Icon name='search' />Search</span></Link>
      </Menu.Item>
    </Menu>);
    const view = (this.props.channelListStatus !== 'SUCCESS'?loadingView:responsiveView);
    return(
      <div >
        {view}
      </div>
    );
  }
}

Sidebar.defaultProps = {
  status : {},
  activeChannel : {},
  isMobile : false,
  channels : [],
  channelListStatus : 'INIT',
  handleSignout : () => {console.log('sidebar props Error');},
  handleSearchClick : () => {console.log('sidebar props Error');},
  changeActiveChannel : () => {console.log('sidebar props Error');},
};
Sidebar.propTypes = {
  status : PropTypes.object.isRequired,
  activeChannel: PropTypes.object.isRequired,
  isMobile : PropTypes.bool.isRequired,
  channels : PropTypes.array.isRequired,
  channelListStatus : PropTypes.string.isRequired,
  handleSignout : PropTypes.func.isRequired,
  handleSearchClick : PropTypes.func.isRequired,
  changeActiveChannel : PropTypes.func.isRequired,
};


export default Sidebar;
