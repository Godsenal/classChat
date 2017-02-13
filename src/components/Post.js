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
    const post = {
      title : this.state.title,
      contents : this.state.contents
    };

    this.props.handlePost(post);

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
  handlePost : PropTypes.func.isRequired,
};
export default Post;
