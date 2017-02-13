import React, { PropTypes } from 'react'
import {Link} from 'react-router';
class ListPreview extends React.Component {
  render () {
    return(
      <div className="col s6">
          <Link to={this.props._id} style={{'textDecoration':'none'}}>
          <div className="card hoverable white darken-1">
            <div className="card-content black-text ">
              <span className="card-title" ><h3 >{this.props.title}</h3></span>
              <p>{this.props.contents.substr(0,100).length==100?this.props.contents.substr(0,100)+'...':this.props.contents.substr(0,100)}</p>
            </div>
            <div className="card-action">
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
  contents: PropTypes.string.isRequired
};
export default ListPreview;
