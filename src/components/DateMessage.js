import React, { PropTypes } from 'react';
import moment from 'moment';
import {Divider} from 'semantic-ui-react';
import {Message} from './';

class DateMessage extends React.Component {
  constructor(){
    super();
  }
  render () {
    return(
      <div>
        <Divider horizontal>{moment(this.props.date).format('LL')}</Divider>
        {this.props.messages.map((message, i) => {
          return <Message key={i} currentUser={this.props.currentUser} {...message} />;
        })}
      </div>
    );
  }
}

DateMessage.propTypes = {
  date : PropTypes.number.isRequired,
  messages : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
};

DateMessage.defaultProps = {
  date : 0,
  messages : [],
  currentUser : '',
};


export default DateMessage;
