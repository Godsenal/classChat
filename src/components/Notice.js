import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import NoticeList from './NoticeList';
import Post from './Post';
import * as api from './api';

class Notice extends React.Component {
  constructor(){
    super();
    this.state = {
      status : 'List',
      notices : [],
      success : false,
    };
  }
  componentDidMount() {
    api.fetchNoticeList().then(notices => {
      this.setState({
        notices
      });
    });
  }
  handlePost = (data) => {
    api.addPost(data).then(success =>{
      this.setState({
        success
      });
    });
  }
  currentStatus(){
    if(this.state.status == 'List'){
      return(
        <div>
          <button onClick={()=>this.setState({status:'Post'})}>Post</button>
          <NoticeList notices={this.state.notices} />
        </div>
      );
    }
    else if(this.state.status == 'Post'){
      return  (
        <Post handlePost={this.handlePost} />
      );

    }


  }
  render () {
    return(
      <div>
        {this.currentStatus()}
      </div>
    );
  }
}

export default Notice;
