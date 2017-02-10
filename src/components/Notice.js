import React, { PropTypes } from 'react';
import * as api from './api';
class Notice extends React.Component {
  constructor(){
    super();
    this.state = {
      notices : 'hi'
    };
  }
  componentDidMount() {
    api.fetchNoticeList().then(notices => {
      this.setState({
        notices
      });
    });
  }
  render () {
    return(
      <div>{this.state.notices}</div>
    );
  }
}

export default Notice;
