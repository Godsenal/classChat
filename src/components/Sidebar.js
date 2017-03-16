import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import {Menu, Dropdown, Icon, Input, Loader, Dimmer} from 'semantic-ui-react';


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
    const mobileView = (this.props.isMobile?
      <Menu>
          <Menu.Item >
            <Dropdown item text='MENU'>
              <Dropdown.Menu>
                <Dropdown.Header content={this.props.status.currentUser}/>
                <Dropdown.Divider/>
                <Dropdown.Header content='Profile'/>
                <Dropdown.Item>My Profile</Dropdown.Item>
                <Dropdown.Item onClick={this.props.handleSignout}>Sign out</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Header content='Channel'/>
                  {this.props.channels.map((channel)=>{
                    return(<Dropdown.Item name={channel.name} active={activeChannelItem === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}>#{channel.name}</Dropdown.Item>);
                  })}
                <Dropdown.Header content='search'/>
                  <Dropdown.Item name='search' onClick={this.handleSearchClick}>
                    <Icon name='search'/>Search Channel
                  </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
        :
    <Menu style = {{'height':'100vh'}} borderless vertical>
      <Menu.Header color='red'>
        <Dropdown item text={this.props.status.currentUser}>
          <Dropdown.Menu>
            <Dropdown.Item>My Profile</Dropdown.Item>
            <Dropdown.Item onClick={this.props.handleSignout}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Header>
      <Menu.Item>
        <Menu.Header>CHANNELS</Menu.Header>
        <Menu.Menu>
          {this.props.channels.map((channel)=>{
            return(<Menu.Item name={channel.name} active={activeChannelItem === channel.name} key={channel.id} onClick={()=>this.handleChannelClick(channel)}>#{channel.name}</Menu.Item>);
          })}
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item name='search' onClick={this.handleSearchClick}>
        <Icon name='search'/>Search Channel
      </Menu.Item>
      <Menu.Item>
        <Link to ='/search' onClick={this.toggleSide}><span><Icon name='search' />Search</span></Link>
      </Menu.Item>
    </Menu>);
    return(
      <div>
        {mobileView}
      </div>
    );
  }
}

Sidebar.propTypes = {
  status : PropTypes.object.isRequired,

};


export default Sidebar;
