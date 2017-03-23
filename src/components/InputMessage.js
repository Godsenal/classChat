import React, { PropTypes } from 'react'
import {Button, Icon} from 'semantic-ui-react';
import styles from '../Style.css';
class InputMessage extends React.Component {
  constructor(){
    super();
    this.state = {
      message : '',
    }
    this.handleKeyPress= this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    this.setState({
      message : e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.props.addMessage(this.state.message);
      this.setState({message : ''});
    }
  }
  render () {
    return(
      <div className={styles.messageInputContainer}>
        <Button className={styles.messageInputButton} icon>
          <Icon name='plus' />
        </Button>
        <textArea className={styles.messageInput} type ='text' value={this.state.message} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
      </div>
    );
  }
}
InputMessage.propTypes ={
  addMessage : PropTypes.func.isRequired,
};

export default InputMessage;
