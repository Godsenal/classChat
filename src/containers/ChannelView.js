import React, { PropTypes } from 'react'
import {connect} from 'react-redux';
import uuid from 'node-uuid';
import {Container, Divider, Form, Button, Icon, Segment} from 'semantic-ui-react';
import {addChannel, listChannel, changeChannel} from '../actions/channel';

import ChatView from './ChatView';
import {ChannelList} from '../components';

class ChannelView extends React.Component {
  constructor(){
    super();
    this.state = {
      name: '',
    };
    this.addChannel = this.addChannel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeChannel = this.changeChannel.bind(this);
  }
  componentDidMount(){
    this.props.listChannel(this.props.currentUser)
      .then(() => {
      });
  }
  addChannel(e){
    e.preventDefault();
    if(this.state.name !== ''){
      let channel = {
        name: this.state.name,
        id: `${Date.now()}${uuid.v4()}`,
        private: false,
        participants: [this.props.currentUser],
      };
      this.props.addChannel(channel)
        .then(() => {
          this.setState({name : ''});
        });
    }
    else{
      Materialize.toast('Comment can not be null!', 2000);
    }
  }
  changeChannel(channel){
    console.log(channel);
    this.props.changeChannel(channel);
  }
  handleChange(e){
    this.setState({
      name : e.target.value,
    });
  }
  render () {
    return(
      <div>
        <ChatView />
        <ChannelList channels={this.props.channels} changeChannel={this.changeChannel} />
        <Form reply onSubmit={this.addChannel}>
          <Form.TextArea name='commentArea' value={this.state.name} onChange={this.handleChange} autoHeight/>
          <Button name='commentBtn' content='Add Reply' labelPosition='left' icon='edit' primary />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channels: state.channel.list.channels,
    isSignedIn: state.authentication.status.isSignedIn,
    isAdmin : state.authentication.status.isAdmin,
    currentUser: state.authentication.status.currentUser,
    currentUserNickname: state.authentication.status.currentUserNickname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addChannel: (channel) => {
      return dispatch(addChannel(channel));
    },
    listChannel: (userName) => {
      return dispatch(listChannel(userName));
    },
    changeChannel: (channel) => {
      return dispatch(changeChannel(channel));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelView);
