import React,{Component, PropTypes} from 'react';
import {Popup, Button } from 'semantic-ui-react';
import moment from 'moment';
import styles from '../Style.css';

class Message extends Component {
  constructor(){
    super();
  }
  handleAddGroup = (userName) => {
    var sortParticipants = [this.props.currentUser, userName].sort();
    var group ={
      name: (sortParticipants[0] + '+' + sortParticipants[1]),
      participants : sortParticipants,
      type : 'DIRECT',
    };
    this.props.addGroup(group);
  }
  render () {
    //const myMessage = (this.props.currentUser === this.props.userName)?styles.flexMyMessage:styles.flexMessage;

    return(
      <div>
        <div className={styles.flexMessage}>
          <div className={styles.messageImg}>
            <img className={styles.messageImg} src='https://semantic-ui.com/images/avatar/small/matt.jpg'/>
          </div>
          <div className={styles.messageContents}>
            <Popup
              key={this.props.userName}
              hoverable
              flowing
              trigger={<span style={{'fontWeight':'bold'}}>{this.props.userName}</span>}>
              <Button onClick={ () => this.handleAddGroup(this.props.userName)}>1:1 채팅하기</Button>
            </Popup>
            <span className='grey-text' style={{'fontStyle':'italic','fontSize':10}}> ..{moment(this.props.created).fromNow()}</span>
            <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}>{this.props.contents}</p>
          </div>
        </div>
      </div>
    );
  }
}
Message.propTypes = {
  userName : PropTypes.string.isRequired,
  created : PropTypes.string.isRequired,
  contents : PropTypes.string.isRequired,
  addGroup : PropTypes.func.isRequired,
  currentUser : PropTypes.string.isRequired,
};
export default Message;
