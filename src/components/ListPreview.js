import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';
import {Icon} from 'semantic-ui-react';
import moment from 'moment';

class ListPreview extends Component {
  render () {

    const imgSrc = 'img/' + 'react' + '.png';
    return(
        <div className="container col s12 m6 l4">
          <Link to={this.props._id} style={{'textDecoration':'none'}}>
          <div className="card hoverable white darken-1">
            <div className="card-image">
              <img src={imgSrc}/>
              <p className="card-title white-text" style = {{'fontWeight' : 'bold','wordWrap':'break-word','whiteSpace':'pre-wrap'}} >{this.props.title}</p>
            </div>
            <div className="card-action">
              <div className='row'>
                <span className= 'black-text'><Icon name='calendar' />{moment(this.props.published_date).format('MMMM Do YYYY')}</span>
                <span className='right black-text'><Icon name='comments' />{this.props.comments.length}comments</span>
              </div>
              <div className='row'>
                <span className= 'black-text'><Icon name='folder' />{this.props.type.toUpperCase()}</span>
                <span className='right'><Icon name='write' />by {this.props.authorNickname}</span>
              </div>
            </div>
          </div>
          </Link>
        </div>
    );
  }
}
ListPreview.propTypes = {
  type : PropTypes.string.isRequired,
  _id:PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  published_date: PropTypes.string.isRequired,
  authorNickname: PropTypes.string.isRequired,
};
export default ListPreview;
