import React,{Component, PropTypes} from 'react';
import {Comment} from './';

class CommentList extends Component {
  constructor(){
    super();
  }
  render () {
    return(
      <div className='row'>
        <div className='col s12'>
          <div className='divider'/>
          {this.props.comments.map((comment) => {
            return <Comment
                      key={comment._id}
                      postAuthor={this.props.postAuthor}
                      isAdmin={this.props.isAdmin}
                      isSignedIn={this.props.isSignedIn}
                      currentUser={this.props.currentUser}
                      deleteComment={this.props.deleteComment}
                      editComment={this.props.editComment}
                      {...comment} />;
          })}
        </div>
      </div>
    );
  }
}

CommentList.propTypes = {
  postAuthor : PropTypes.string.isRequired,
  isAdmin : PropTypes.bool.isRequired,
  isSignedIn : PropTypes.bool.isRequired,
  currentUser : PropTypes.string.isRequired,
  comments : PropTypes.array.isRequired,
  deleteComment : PropTypes.func.isRequired,
  editComment : PropTypes.func.isRequired,
};
export default CommentList;
