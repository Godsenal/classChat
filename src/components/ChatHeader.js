import React, { PropTypes } from 'react'
import {Icon, Divider} from 'semantic-ui-react';
import styles from '../Style.css';

class ChatHeader extends React.Component {
  render () {
    return(
      <div>
      <div className={styles.chatHeader}>
        <h1 className={styles.chatHeaderName} size='massive'><Icon name='comments outline'/>#{this.props.name}
        </h1>
        <input id='messageSearch' className={styles.chatHeaderSearch} placeholder='Search Message...'/>
        <label htmlFor='messageSearch'><Icon size='large' name='search'/></label>
      </div>
    <Divider/>
  </div>
    );
  }
}

export default ChatHeader;
