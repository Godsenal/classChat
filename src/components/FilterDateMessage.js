import React, { PropTypes } from 'react';
import {Divider, List} from 'semantic-ui-react';
import {FilterMessage} from './';
import moment from 'moment';
class FilterDateMessage extends React.Component {
  render () {
    return(
      <div >
        <Divider horizontal inverted>{moment(this.props.date).format('LL')}</Divider>
        <List divided relaxed inverted>
        {this.props.messages.map((message, i) => {
          return <FilterMessage key={i} currentUser={this.props.currentUser} jumpMessage={this.props.jumpMessage} {...message} />;
        })}
        </List>
      </div>
    );
  }
}
FilterDateMessage.propTypes = {
  date: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
  jumpMessage: PropTypes.func.isRequired,
};
export default FilterDateMessage;
