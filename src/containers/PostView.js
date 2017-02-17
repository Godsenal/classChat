import React, { Component, PropTypes } from 'react';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {Container, Divider, Form, Button, Icon, Segment} from 'semantic-ui-react';
import moment from 'moment';

import {Post, CommentList} from '../components';
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
    this.addComment = this.addComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
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
          browserHistory.push('/' + this.state.post.type);
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

  addComment(e){
    e.preventDefault();
    if(this.state.comment !== ''){
      let comment = {
        author: this.props.currentUser,
        authorNickname : this.props.currentUserNickname,
        comment : this.state.comment,
      };
      this.props.addComment(this.state.post._id, comment )
        .then(() => {
          this.setState({ post: this.props.view.post, comment : ''});
        });
    }
    else{
      Materialize.toast('Comment can not be null!', 2000);
    }
  }
  editComment(commentId, data){
    let comment = {
      comment : data,
    };
    this.props.editComment(this.state.post._id, commentId, comment)
      .then(() => {
        this.setState({ post : this.props.view.post});
      });
  }
  deleteComment(commentId){
    this.props.deleteComment(this.state.post._id, commentId)
      .then(() => {
        this.setState({ post : this.props.view.post});
      });
  }
  handleChange(e){
    this.setState({
      comment : e.target.value,
    });
  }
  commentView(){
    if(this.state.post.comments !== undefined){
      if(this.state.post.comments.length > 0){
        return(<CommentList
                  postAuthor={this.state.post.author}
                  isAdmin={this.props.isAdmin}
                  isSignedIn={this.props.isSignedIn}
                  currentUser={this.props.currentUser}
                  comments={this.state.post.comments}
                  editComment={this.editComment}
                  deleteComment={this.deleteComment} />);
      }
      else{
        return(<h3 className='center'>O comment</h3>);
      }
    }
    else{
      return(<h3 className='center'>Fail to get comments</h3>);
    }
  }
  writeView(){
    if(this.props.isSignedIn){
      return(
        <div>
          <div className='row'>
            <span className= 'left' style={{'fontWeight':'bold'}}>{this.props.currentUserNickname}</span>
          </div>
          <div className='row'>
            <Form reply onSubmit={this.addComment}>
              <Form.TextArea name='commentArea' value={this.state.comment} onChange={this.handleChange} autoHeight/>
              <Button name='commentBtn' content='Add Reply' labelPosition='left' icon='edit' primary />
            </Form>
          </div>
        </div>
      );
    }
    return(
      <div>
        <h6 className = 'center'>Please
          <Link to = '/signin'> Sign in </Link>to leave your comment!</h6>
      </div>
    );
  }
  /* line breaker added */
  render () { /* NOTE -Never change states in return statement. */
    const backLink = '/' + this.state.post.type;
    const viewMode = (
      <Segment basic>
        {this.props.isAdmin?
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
          </div> : null
        }
      <Segment basic>
        <h1 className="center-align" style={{'fontWeight':'bold','fontStyle':'italic','fontSize':'3em'}}>{this.state.post.title}</h1>
      </Segment>
      <div className="divider"></div>
      <div className='section'>
        <Segment basic>
        <div className='row'>
          <h6 className="left pink-text">
            <Icon name='calendar' />
            {moment(this.state.post.published_date).calendar()}
            <Icon name='comments' />
              {this.state.post.comments!==undefined?this.state.post.comments.length:0} comments
          </h6>
          <h6 className="right blue-text">written by {this.state.post.authorNickname}</h6>
        </div>
        <Divider />
        <p className="flow-text" style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}} >{this.state.post.contents}</p>
        </Segment>
      </div>
      <div className="divider"/>
      <Link to ={backLink} className="waves-effect waves-light btn right">글 목록</Link>
      <Segment basic>
        <div className='section'>
          <h2 className='center'><Icon name='comments' />Comments</h2>

          {this.commentView()}
          {this.writeView()}
        </div>
      </Segment>
    </Segment>);
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
  currentUserNickname : PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  isAdmin : PropTypes.bool.isRequired,
  addComment : PropTypes.func.isRequired,
  editComment : PropTypes.func.isRequired,
  deleteComment : PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    view: state.post.view,
    deleteStatus: state.post.delete.status,
    isSignedIn: state.authentication.status.isSignedIn,
    isAdmin : state.authentication.status.isAdmin,
    currentUser: state.authentication.status.currentUser,
    currentUserNickname: state.authentication.status.currentUserNickname,
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
