import React, { Component, PropTypes } from 'react';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import moment from 'moment';

import {Post} from '../components';
import {viewPost, deletePost, editPost, addComment, editComment, deleteComment} from '../actions/post';

class PostView extends Component {
  constructor(){
    super();
    this.state = {
      mode : 'VIEW',
      post : {},
      success : false,
      comment : '',
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    this.props.viewPost(this.props.params.postId)
      .then(() => {
        this.setState({post: this.props.view.post });
      });
  }
  handleDelete(){
    if(!this.props.isSignedIn){
      Materialize.toast('Please Sign in First!', 2000);
    }
    else if(this.props.currentUser !== this.state.post.author){
      Materialize.toast('No Authorization!', 2000);
    }
    else{
      this.props.deletePost(this.props.params.postId)
        .then(() => {
          browserHistory.goBack();
          Materialize.toast('Delete Completed!', 2000);
        });
    }
  }
  handleEdit(data){
    let post = {
      title : data.title,
      contents : data.contents,
    };
    this.props.editPost(this.state.post._id, post)
      .then(() => { //for initialize post
        this.setState({post: this.props.view.post , mode : 'VIEW'});
      });
  }
  toggleEdit(){
    if(!this.props.isSignedIn){
      Materialize.toast('Please Sign in First!', 2000);
    }
    else if(this.props.currentUser !== this.state.post.author){
      Materialize.toast('No Authorization!', 2000);
    }
    else{
      this.setState({
        mode : 'EDIT',
      });
    }
  }
  /* TEMP */
  handleComment(){
    let comment = {
      author: this.props.currentUser,
      authorNickname : this.props.currentUser,
      comment : this.state.comment,
    };
    this.props.addComment(this.state.post._id, comment )
      .then(() => {
        this.setState({ post: this.props.view.post, comment : ''});
      });
  }
  handleChange(e){
    this.setState({
      comment : e.target.value,
    });
  }
  /* TEMP */
  render () { /* NOTE -Never change states in return statement. */
    const viewMode = (
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
          <li><a
            className="btn-floating yellow darken-1 center-align"
            style = {{'textDecoration' : 'none'}}
            onClick = {this.toggleEdit}>편집</a></li>
        </ul>
        </div>
      <h1 className="center-align">{this.state.post.title}</h1>
      <div className="divider"></div>
      <h6 className="right-align bold-text">{moment(this.state.post.published_date).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      <h6 className="right-align blue-text">written by {this.state.post.authorNickname}</h6>
      <p className="flow-text" >{this.state.post.contents}</p>
      <div className="divider"></div>
      <div className='section'>
        <input className='col s10' name= 'id' type="text" value={this.state.comment} onChange={this.handleChange}/>
        <button className='btn waves-effect waves-light black col s2' onClick={this.handleComment}>Submit</button>
          {this.state.post.comments!== undefined?
            this.state.post.comments.map((comment) => { return <button key={comment._id}>{comment.comment}</button>;})
            :<div>hi</div>
          }
      </div>
    </div>);
    const postMode = (<Post mode = 'EDIT'
                            handleEdit={this.handleEdit}
                            title={this.state.post.title}
                            contents={this.state.post.contents} />);
    return(
      <div>
        {this.state.mode ==='EDIT'?postMode:viewMode}
      </div>
    );
  }
}

PostView.propTypes = {
  viewPost : PropTypes.func.isRequired,
  view : PropTypes.object.isRequired,
  currentUser: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => {
  return {
    view: state.post.view,
    deleteStatus: state.post.delete.status,
    isSignedIn: state.authentication.status.isSignedIn,
    currentUser: state.authentication.status.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    viewPost: (postId) => {
      return dispatch(viewPost(postId));
    },
    deletePost: (postId) => {
      return dispatch(deletePost(postId));
    },
    editPost: (postId, post) => {
      return dispatch(editPost(postId, post));
    },
    addComment: (postId, comment) => {
      return dispatch(addComment(postId, comment));
    },
    editComment: (postId, commentId, comment) => {
      return dispatch(editComment(postId, commentId, comment));
    },
    deleteComment: (postId, commentId) => {
      return dispatch(deleteComment(postId, commentId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
