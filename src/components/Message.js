import React,{Component, PropTypes} from 'react';
import {Label, Image, Segment,Grid } from 'semantic-ui-react';
import moment from 'moment';
import styles from '../Style.css';

class Message extends Component {
  constructor(){
    super();
  }
  render () {
    //const myMessage = (this.props.currentUser === this.props.userName)?styles.flexMyMessage:styles.flexMessage;
    return(
        <div className={styles.flexMessage}>
          <div className={styles.messageImg}>
          <img src='https://semantic-ui.com/images/avatar/small/matt.jpg'/>
          </div>
          <div className={styles.messageContents}>
            <span style={{'fontWeight':'bold'}}>{this.props.userName}</span>
            <span className='grey-text' style={{'fontStyle':'italic','fontSize':10}}> ..{moment(this.props.created).fromNow()}</span>
            <p style={{'wordWrap':'break-word','whiteSpace':'pre-wrap'}}>{this.props.contents}</p>
          </div>
        </div>
    );
  }
}
export default Message;
