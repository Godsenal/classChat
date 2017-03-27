import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import {Menu, Dropdown, Icon, Segment, Loader, Dimmer} from 'semantic-ui-react';

import styles from '../Style.css';


class Sidebar extends React.Component {
  constructor(){
    super();
    this.state = {
      activeItem :'',
      activeChannelItem :'public',
    };
  }
  handleChannelClick = (channel) => {

    this.setState({
      activeChannelItem : channel.name,
    });
    this.props.changeActiveChannel(channel);
  }
  handleSearchClick = (e) => {
    this.props.handleSearchClick();
  }
  render () {
    const {activeItem} = this.state;
    const {activeChannelItem} = this.state;
    const loaderStyle = this.props.isMobile?styles.channelLoaderMobile:styles.channelLoader;
    const loadingView =
            <Segment basic className={loaderStyle}>
              <Dimmer active inverted>
                <Loader indeterminate>Preparing Channels</Loader>
              </Dimmer>
            </Segment>;
    const responsiveView = (this.props.isMobile?
      <Menu attached >
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
                return(<Dropdown.Item name={channel.name} active={this.props.activeChannel.name === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}><Icon name='hashtag'/>{channel.name}</Dropdown.Item>);
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={styles.balooFont} item text='Group'>
          <Dropdown.Menu color='red'>
            {this.props.channels.map((channel)=>{
              if(channel.type === 'GROUP')
                return(<Dropdown.Item color='red' name={channel.name} active={this.props.activeChannel.name === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}><Icon name='group'/>{channel.name}</Dropdown.Item>);
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item className={styles.balooFont} name='search' onClick={this.handleSearchClick}>
          <Icon name='search'/>Search Channel
        </Menu.Item>
      </Menu>
        :
    <Menu style = {{'height':'100vh'}} vertical attached >
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
          if(channel.type === 'CHANNEL')
            return(<Menu.Item color='violet' name={channel.name} active={activeChannelItem === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}><Icon name='hashtag'/>{channel.name}</Menu.Item>);
        })}
      <Menu.Item header className={styles.balooFont}>GROUPS</Menu.Item>
        {this.props.channels.map((channel)=>{
          if(channel.type === 'GROUP')
            return(<Menu.Item color='red' name={channel.name} active={activeChannelItem === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}><Icon name='group'/>{channel.name}</Menu.Item>);
        })}
      <Menu.Item header className={styles.balooFont}>DIRECT</Menu.Item>
        {this.props.channels.map((channel)=>{
          if(channel.type === 'DIRECT')
            return(<Menu.Item color='red' name={channel.name} active={activeChannelItem === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}><Icon name='group'/>{channel.name}</Menu.Item>);
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

Sidebar.propTypes = {
  status : PropTypes.object.isRequired,

};


export default Sidebar;
