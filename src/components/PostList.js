import React,{Component, PropTypes} from 'react';
import {ListPreview} from './';

class PostList extends Component {
  constructor(){
    super();
  }
  render () {
    return(
      <div>
        {this.props.posts.map((post) => {
          return <ListPreview key={post._id} {...post} />;
        })}
      </div>
    );
  }
}

PostList.propTypes = {
  posts : PropTypes.array.isRequired,
};
export default PostList;
