import React, { PropTypes } from 'react';
import moment from 'moment';
import {Divider} from 'semantic-ui-react';
import {Message} from './';

class DateMessage extends React.Component {
  constructor(){
    super();
  }
  shouldComponentUpdate(nextProps){ // 필요한가? 
    if(this.props.messages !== nextProps.messages){
      return true;
    }
    if(this.props.receivedMessage !== nextProps.receivedMessage){
      return true;
    }
    if(this.props.messageJumpID !== nextProps.messageJumpID){
      return true;
    }
    if(this.props.lastDateID !== nextProps.lastDateID){
      return true;
    }
    return false;
  }
  render () {
    const {receivedMessage} = this.props;
    const receivedID = receivedMessage.length !== 0 ? receivedMessage[0].id:false ; // 받은 메시지 중 첫번째 메시지
    return(
      <div>
        <Divider horizontal>{moment(this.props.date).format('LL')}</Divider>
        {this.props.messages.map((message, i) => {
          return <Message key={i}
                          currentUser={this.props.currentUser}
                          addGroup={this.props.addGroup}
                          isReceived={receivedID == message.id}
                          messageJumpID={this.props.messageJumpID}
                          lastDateID={this.props.lastDateID}
                          scrollIntoJump={this.props.scrollIntoJump}
                          scrollIntoReceive={this.props.scrollIntoReceive}
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
  receivedMessage : PropTypes.array.isRequired,
  currentUser : PropTypes.string.isRequired,
  addGroup : PropTypes.func.isRequired,
  scrollIntoReceive : PropTypes.func.isRequired,
  scrollIntoDate : PropTypes.func.isRequired,
  lastDateID : PropTypes.string.isRequired,
  messageJumpID : PropTypes.string.isRequired,
  scrollIntoJump :PropTypes.func.isRequired,
};

DateMessage.defaultProps = {
  date : 0,
  messages : [],
  receivedMessage : [],
  currentUser : '',
  addGroup : () => {console.log('props Error');},
  scrollIntoReceive : () => {console.log('props Error(DateMessage)');},
  scrollIntoDate : () => {console.log('props Error(DateMessage)');},
  scrollIntoJump : () => {console.log('props Error(DateMessage)');},
  lastDateID : '',
  messageJumpID : '',
};


export default DateMessage;
