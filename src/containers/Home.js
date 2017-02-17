import React,{Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {PostList} from '../components';
import {listPost} from '../actions/post';

class Home extends Component{
  constructor(){
    super();
    this.state = {
      posts : [],
      success : false,
    };
  }
  componentDidMount() {
    this.props.listPost('home')
      .then(() => {
        this.setState({posts: this.props.posts});
      });
  }
  render () {
    return(
      <div>
        <div className='row'>
          <h2 className='center'>HOME</h2>
        </div>
        <div className="row">
          <div className="col s12">
            <PostList posts={this.state.posts} />
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  listPost : PropTypes.func.isRequired,
  posts : PropTypes.array.isRequired,
};
const mapStateToProps = (state) => {
  return {
    posts: state.post.list.posts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listPost: (type) => {
      return dispatch(listPost(type));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
