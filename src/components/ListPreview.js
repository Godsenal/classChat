import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';
import moment from 'moment';

class ListPreview extends Component {
  render () {
    return(
      <div className="col s6">
          <Link to={this.props._id} style={{'textDecoration':'none'}}>
          <div className="card hoverable white darken-1">
            <div className="card-content black-text ">
              <span className="card-title" ><h3 >{this.props.title}</h3></span>
              <p>{this.props.contents.substr(0,50).length==50?this.props.contents.substr(0,50)+'...':this.props.contents.substr(0,50)}</p>
            </div>
            <div className="card-action">
              <span className= 'black-text'>{moment(this.props.published_date).format('MMMM Do YYYY')}</span>
              <span className='right'>by {this.props.authorNickname}</span>
            </div>
          </div>
          </Link>
        </div>
    );
  }
}
ListPreview.propTypes = {
  _id:PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  published_date: PropTypes.string.isRequired,
  authorNickname: PropTypes.string.isRequired,
};
export default ListPreview;
