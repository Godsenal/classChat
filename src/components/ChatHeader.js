import React, { PropTypes } from 'react';
import {Icon, Divider, Dropdown, Modal, Button} from 'semantic-ui-react';
import styles from '../Style.css';

class ChatHeader extends React.Component {
  constructor(){
    super();
    this.state = {
      open : false,
    };
  }
  showModal = () => this.setState({open : true});
  closeModal = () => this.setState({ open: false });
  render () {
    const {open} = this.state;
    const searchModal = <Modal open={open} basic size ='small' onClose={this.closeModal}>
                          <Modal.Header>
                            Search Message
                          </Modal.Header>
                          <Modal.Content>
                            <input id='messageSearch' placeholder='Search Message...'/>
                            <label htmlFor='messageSearch'><Icon size='large' name='search'/></label>
                          </Modal.Content>
                          <Modal.Actions>
                            <Button negative>
                              No
                            </Button>
                            <Button positive icon='checkmark' labelPosition='right' content='Yes' />
                          </Modal.Actions>
                        </Modal>;
    return(
      <div>
        {searchModal}
        <div className={styles.chatHeader}>
          <span className={styles.chatHeaderName} size='massive'><Icon name='comments outline'/>#{this.props.name}</span>
          <Dropdown pointing text={this.props.participants.length.toString()+'명'} button icon='group' labeled className='icon' >
            <Dropdown.Menu>
              {this.props.participants.map((participant) => {
                return(<Dropdown.Item key={participant} text={participant} />)
              })}
            </Dropdown.Menu>
          </Dropdown>
          <Button icon color='black' onClick={this.showModal}>
            <Icon name='search' />
          </Button>
        </div>
        <Divider/>
      </div>
    );
  }
}
ChatHeader.propTypes = {
  name : PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
  id : PropTypes.string.isRequired,
};
ChatHeader.defaultProps = {
  name : '',
  participants : [],
  id : '',
};
export default ChatHeader;
