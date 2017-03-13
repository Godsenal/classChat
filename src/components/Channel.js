import React, { PropTypes } from 'react'

class Channel extends React.Component {
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    let channel = {
      name : this.props.name,
      id : this.props.id,
    };
    this.props.changeActiveChannel(channel);
  }
  render () {
    return(
      <a onClick={this.handleClick}>{this.props.name}</a>
    );
  }
}

export default Channel;
