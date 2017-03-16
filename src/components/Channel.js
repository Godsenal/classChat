import React, { PropTypes } from 'react'

class Channel extends React.Component {
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    this.props.changeActiveChannel(this.props.channel);
  }
  render () {
    return(
      <a onClick={this.handleClick}>{this.props.channel.name}</a>
    );
  }
}

export default Channel;
