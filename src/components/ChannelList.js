import React, { PropTypes } from 'react'
import {Channel} from './';

class ChannelList extends React.Component {
  constructor(){
    super();
  }
  render () {
    return(
      <div>
        {this.props.channels.map((channel) => {
          return <Channel key={channel._id} changeActiveChannel={this.props.changeActiveChannel} {...channel} />
        })}
      </div>
    );
  }
}

export default ChannelList;
