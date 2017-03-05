import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {Input, Header, Icon, Button, Segment} from 'semantic-ui-react';

import {searchPost } from '../actions/post';
import {PostList } from '../components';

class SearchView extends React.Component {
  constructor(){
    super();
    this.state = {
      searchWord : '',
      searchedWord : '',
    };
  }
  componentDidMount(){
    this.setState({
      searchWord : this.props.searchWord,
    });
    this.props.searchPost(this.state.searchWord);
  }
  handleChange = (e) => {
    this.setState({
      searchWord : e.target.value
    });
  }
  handleClick = () => {
    this.setState({
      searchedWord : this.state.searchWord,
    });
    this.handleSearch();
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.setState({
        searchedWord : this.state.searchWord,
      });
      this.handleSearch();
    }
  }
  handleSearch = () =>{
    this.props.searchPost(this.state.searchWord);
  }
  render () {
    const postList = (this.props.list.posts.length>0?<PostList posts={this.props.list.posts} />
                                                    :<Header as='h1' textAlign='center' icon className='red-text'>
                                                        <Icon name='find' />
                                                        Nothing Found
                                                     </Header>);
    return(
      <div style = {{'height':'100vh'}}>
        <div className='row'>
          <Header as='h1' textAlign='center' icon className='pink-text'>
            <Icon name='search'/>
            {this.state.searchedWord?`Search result for : '${this.state.searchedWord}'`:null }
          </Header>
        </div>
        <div className='row'>
          <Input className = 'col s12' icon='search' placeholder='Search...' value = {this.state.searchWord} onKeyPress={this.handleKeyPress} onChange = {this.handleChange} />
        </div>
        <Segment>
          <div className='row'>
            {postList}
          </div>
        </Segment>
      </div>
    );
  }
}

SearchView.defaultProps = {
  searchWord: '',
  search: {},
  list: {},
};
SearchView.propTypes = {
  searchWord: PropTypes.string.isRequired,
  searchPost: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
  list: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    search: state.post.search,
    list: state.post.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchPost: (searchWord) => {
      return dispatch(searchPost(searchWord));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);
