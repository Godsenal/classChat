import React,{Component,PropTypes} from 'react';
import {Button} from 'react-materialize';

class Post extends Component {
  constructor(){
    super();
    this.state={
      title: '',
      contents: ''
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentsChange = this.handleContentsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.setState({
      title : this.props.title,
      contents : this.props.contents
    });
  }
  handleTitleChange(e){
    this.setState({
      title:e.target.value
    });
  }
  handleContentsChange(e) {
    this.setState({
      contents: e.target.value
    });
  }
  handleSubmit(){
    if(this.props.mode === 'POST'){
      let post = {
        author: this.props.currentUser,
        authorNickname: this.props.currentUserNickname,
        title : this.state.title,
        contents : this.state.contents
      };
      this.props.handlePost(post);
    }
    else if(this.props.mode === 'EDIT'){
      let post = {
        title : this.state.title,
        contents : this.state.contents
      };
      this.props.handleEdit(post);
    }

    this.setState({
      title : '',
      contents : '',
    });
  }
  render () {
    return(
      <div>
        <input value={this.state.title} onChange={this.handleTitleChange}/>
        <textarea value={this.state.contents} onChange={this.handleContentsChange}/>
        <Button onClick={this.handleSubmit}>SUBMIT</Button>
      </div>
    );
  }
}

Post.propTypes = {
  mode : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  contents : PropTypes.string.isRequired,
  handleEdit : PropTypes.func.isRequired,
  handlePost : PropTypes.func.isRequired,
  currentUser : PropTypes.string.isRequired,
  currentUserNickname : PropTypes.string.isRequired,
};

Post.defaultProps = {
  title : '',
  contents : '',
  currentUser : '',
  currentUserNickname : '',
  handleEdit : () => {console.log('Invalid redirect');},
  handlePost : () => {console.log('Invalid redirect');},
};
export default Post;
