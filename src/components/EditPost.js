import React, { PropTypes } from 'react'

class EditPost extends React.Component {
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
  componentDidMount(){
    if(this.props.title)
      this.setState({title: this.props.title});

    if(this.props.contents)
      this.setState({contents: this.props.contents});

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
      _id: this.props._id,
      title : this.state.title,
      contents : this.state.contents
    };

    this.props.handleEdit(post);

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
        <button onClick={this.handleSubmit}>submit</button>
      </div>
    );
  }
}
}

export default EditPost;
