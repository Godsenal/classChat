import React, { PropTypes } from 'react';
import {Link, browserHistory} from 'react-router';

import * as api from './api';

class PostView extends React.Component {
  constructor(){
    super();
    this.state = {
      post : {},
      success : false,
    };
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount(){
    api.fetchPostView(this.props.params.postId).then(post => {
      this.setState({
        post
      });
    });
  }
  handleDelete(){
    api.deletePost(this.props.params.postId).then(success => {
      if(success){
        browserHistory.goBack();
        console.log('delete success');
      }
    });

  }

  render () {

    return(
      <div className="col s12">
        <Link to ="/notice" className="waves-effect waves-light btn">글 목록</Link>
          <div className="fixed-action-btn horizontal">
          <a className="btn-floating btn-large red">
            <i className="large material-icons">mode_edit</i>
          </a>
          <ul>
            <li><a
              className="btn-floating red center-align"
              style = {{'textDecoration' : 'none'}}
              onClick = {this.handleDelete}>삭제</a></li>
            <li><a className="btn-floating yellow darken-1 center-align" style = {{'textDecoration' : 'none'}}>편집</a></li>
            <li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
            <li><a className="btn-floating blue"><i className="material-icons">attach_file</i></a></li>
          </ul>
          </div>
        <h1 className="center-align">{this.state.post.title}</h1>
        <div className="divider"></div>
        <h6 className="right-align">{this.state.post.published_date}</h6>
        <p className="flow-text" >{this.state.post.contents}</p>
      </div>
    );
  }
}

export default PostView;
