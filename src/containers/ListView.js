import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Segment} from 'semantic-ui-react';

import { addPost, listPost } from '../actions/post';
import {PostList, Post} from '../components';

class ListView extends Component {
  constructor(){
    super();
    this.state = {
      type : '',
      status : 'LIST',
      posts : [],
      success : false,
    };
  }
  componentDidMount() {
    let type = this.props.location.pathname.replace('/','');
    this.props.listPost(type)
      .then(() => {
        this.setState({posts: this.props.posts, type});
      });

  }
  handlePost = (data) => {
    this.props.addPost(this.state.type, data)
      .then(()=>{
        this.setState({
          status:'LIST',
          posts: this.props.posts,
        });
      });
  }
  handleClick = () => {
    if(this.props.isSignedIn)
      this.setState({status:'POST'});
    else {
      Materialize.toast('Please Sign in First!', 2000);
    }
  }/*
  currentStatus(){
    if(this.state.status == 'List'){
      return(
      <Segment color='grey'>
          <PostList posts={this.state.posts} />
          {this.state.type !== 'home'?
          <div className="col s1">
            <div className="fixed-action-btn">
              <a className="btn-floating btn-large waves-effect waves-light right red" onClick={this.handleClick}>
                <i className="material-icons">add</i>
              </a>
            </div>
          </div>:null}
      </Segment>
      );
    }
    else if(this.state.status == 'Post'){
      return  (
        <Post mode='POST' handlePost={this.handlePost} currentUser={this.props.currentUser} currentUserNickname={this.props.currentUserNickname} />
      );
    }
  }*/
  render () {
    const listMode =
     (<div className="row">
        <div className=" col s12">
          <PostList posts={this.state.posts} />
        </div>
        {this.props.isAdmin?
        <div className="col s1">
          <div className="fixed-action-btn">
            <a className="btn-floating btn-large waves-effect waves-light right red" onClick={this.handleClick}>
              <i className="material-icons">add</i>
            </a>
          </div>
        </div>:null}
      </div>
    );
    const postMode =
    (<Post
      mode='POST'
      handlePost={this.handlePost}
      currentUser={this.props.currentUser}
      currentUserNickname={this.props.currentUserNickname} />);


    return(
      <div style = {{'height':'100vh'}}>
        <div className='row'>
          <h2 className='center'>{this.state.type.toUpperCase()}</h2>
        </div>
        {this.state.status==='POST'? postMode:listMode}
      </div>
    );
  }
}

ListView.propTypes = {
  listPost : PropTypes.func.isRequired,
  addPost : PropTypes.func.isRequired,
  posts : PropTypes.array.isRequired,
  status : PropTypes.string.isRequired,
  isSignedIn : PropTypes.bool.isRequired,
  isAdmin : PropTypes.bool.isRequired,
  currentUser : PropTypes.string.isRequired,
  currentUserNickname : PropTypes.string.isRequired,
};
const mapStateToProps = (state) => {
  return {
    posts: state.post.list.posts,
    status: state.post.list.status,
    isSignedIn: state.authentication.status.isSignedIn,
    isAdmin: state.authentication.status.isAdmin,
    currentUser: state.authentication.status.currentUser,
    currentUserNickname: state.authentication.status.currentUserNickname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPost : (type, post) => {
      return dispatch(addPost(type, post));
    },
    listPost: (type) => {
      return dispatch(listPost(type));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
