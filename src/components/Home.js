import React,{Component} from 'react';
import {Link} from 'react-router';
import PostList from './PostList';
import Post from './Post';
import * as api from './api';

class Home extends Component{
  constructor(){
    super();
    this.state = {
      status : 'List',
      posts : [],
      success : false,
    };
  }
  componentDidMount() {
    api.fetchCurrentList().then(posts => {
      this.setState({
        posts
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
        </div>
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


export default Home;
