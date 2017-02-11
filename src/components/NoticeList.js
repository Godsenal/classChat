import React,{Component, PropTypes} from 'react';
import ListPreview from './ListPreview';
class NoticeList extends React.Component {
  constructor(){
    super();
  }
  render () {
    return(
      <div>
        {this.props.notices.map(post => {
          return <ListPreview key={post._id} {...post} />;
        })}
      </div>
    );
  }
}

NoticeList.propTypes = {
  notices : PropTypes.array.isRequired,
};
export default NoticeList;
