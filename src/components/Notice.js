import React from 'react';
import {Link} from 'react-router';
import PostList from './PostList';
import Post from './Post';
import * as api from './api';

class Notice extends React.Component {
  constructor(){
    super();
    this.state = {
      type : 'notice',
      status : 'List',
      posts : [],
      success : false,
    };
  }
  componentDidMount() {
    api.fetchNoticeList().then(posts => {
      this.setState({
        posts
      });
    });
  }
  handlePost = (data) => {
    api.addPost(this.state.type,data).then(success =>{
      this.setState({
        status:'List',
        success
      });
      api.fetchNoticeList().then(posts => {
        this.setState({
          posts
        });
      });
    });
  }
  currentStatus(){
    if(this.state.status == 'List'){
      return(
        <div className="row">
          <div className="container col s12">
            <PostList posts={this.state.posts} />
          </div>
          <div className="col s1">
            <div className="fixed-action-btn">
              <a className="btn-floating btn-large waves-effect waves-light right red" onClick={()=>this.setState({status:'Post'})}>
                <i className="material-icons">add</i>
              </a>
            </div>
          </div>
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
