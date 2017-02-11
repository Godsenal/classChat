import React, { PropTypes } from 'react'

class ListPreview extends React.Component {
  render () {
    return(
      <div>
        <div>{this.props.title}</div>
        <div>{this.props.contents}</div>
      </div>
    );
  }
}
ListPreview.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired
};
export default ListPreview;
