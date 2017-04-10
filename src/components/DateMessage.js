import React, { PropTypes } from 'react';
import moment from 'moment';
import {Divider} from 'semantic-ui-react';
import {Message} from './';

class DateMessage extends React.Component {
  constructor(){
    super();
  }
  render () {
    const {receivedMessage} = this.props;
    const receivedID = receivedMessage ? receivedMessage.id:false ;
    return(
      <div>
        <Divider horizontal>{moment(this.props.date).format('LL')}</Divider>
        {this.props.messages.map((message, i) => {
          return <Message key={i}
                          currentUser={this.props.currentUser}
                          addGroup={this.props.addGroup}
                          isReceived={receivedID == message.id}
                          lastDateID={this.props.lastDateID}
                          scrollIntoView={this.props.scrollIntoView}
                          scrollIntoDate={this.props.scrollIntoDate}
                          {...message} />;
        })}
      </div>
    );
  }
}

DateMessage.propTypes = {
  date : PropTypes.number.isRequired,
  messages : PropTypes.array.isRequired,
  receivedMessage : PropTypes.object.isRequired,
  currentUser : PropTypes.string.isRequired,
  addGroup : PropTypes.func.isRequired,
  scrollIntoView : PropTypes.func.isRequired,
  scrollIntoDate : PropTypes.func.isRequired,
  lastDateID : PropTypes.string.isRequired,
};

DateMessage.defaultProps = {
  date : 0,
  messages : [],
  receivedMessage : {},
  currentUser : '',
  addGroup : () => {console.log('props Error');},
  scrollIntoView : () => {console.log('props Error(DateMessage)');},
  scrollIntoDate : () => {console.log('props Error(DateMessage)');},
  lastDateID : '',
};


export default DateMessage;
