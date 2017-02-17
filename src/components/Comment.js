import React, { Component, PropTypes } from 'react';
import {Icon, Form, Button} from 'semantic-ui-react';
import moment from 'moment';

class Comment extends Component {
  constructor(){
    super();
    this.state={
      edit : false,
      comment : '',
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.buttonView = this.buttonView.bind(this);
    this.editView = this.editView.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  toggleEdit(){
    this.setState({edit : true, comment : this.props.comment});
  }
  handleEdit(e){
    e.preventDefault();
    if(this.state.comment){
      this.props.editComment(this.props._id,this.state.comment);
      this.setState({
        edit: false,
        comment: '',
      });
    }
    else{
      Materialize.toast('Comment can not be null!', 2000);
    }

  }
  handleDelete(){
    this.props.deleteComment(this.props._id);
  }
  buttonView(){
    if((this.props.isSignedIn && (this.props.author === this.props.currentUser))||this.props.isAdmin)
      return(
        <div>
          <Icon name ='delete' className="right" style={{'cursor':'pointer'}} onClick={this.handleDelete}/>
          <Icon name='edit' className='right' style={{'cursor':'pointer'}} onClick={this.toggleEdit}/>
        </div>
      );
  }
  editView(){
    if(this.state.edit)
      return(
        <div className='row'>
          <Form reply onSubmit={this.handleEdit}>
            <Form.TextArea name='commentArea' value={this.state.comment} onChange={this.handleChange} autoHeight/>
            <Button name='commentBtn' content='Done' labelPosition='left' icon='edit' primary  floated='right'/>
          </Form>
        </div>
      );
    return(
      <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}>{this.props.comment}</p>
    );
  }
  handleChange(e){
    this.setState({
      comment : e.target.value,
    });
  }
  render () {
    const nickStyle = (this.props.postAuthor === this.props.author?'left pink-text':'left');
    return(
      <div>
        <div className='row'>
          <span className= {nickStyle} style={{'fontWeight':'bold'}}>{this.props.authorNickname}</span>
          <span className='grey-text' style={{'fontStyle':'italic'}}> ..{moment(this.props.published_date).fromNow()}</span>
          {this.buttonView()}
        </div>
        {this.editView()}
        <div className='divider'/>
      </div>
    );
  }
}

Comment.propTypes = {
  comment : PropTypes.string.isRequired,
  _id : PropTypes.string.isRequired,
  editComment : PropTypes.func.isRequired,
  deleteComment : PropTypes.func.isRequired,
  isSignedIn : PropTypes.bool.isRequired,
  author : PropTypes.string.isRequired,
  currentUser : PropTypes.string.isRequired,
  isAdmin : PropTypes.bool.isRequired,
  published_date : PropTypes.string.isRequired,
  postAuthor : PropTypes.string.isRequired,
  authorNickname : PropTypes.string.isRequired,
};
export default Comment;
