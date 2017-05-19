import React, { PropTypes } from 'react';
import {Icon, Divider, Dropdown, Modal, Button, Input} from 'semantic-ui-react';
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
    const {name, participants, id, type, leaveChannel, currentUser} = this.props;
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
    const outBtn = type !== 'CHANNEL' ?<Button icon primary compact onClick={leaveChannel}>
                                        <Icon name='sign out' />
                                      </Button>:null;
    var directName = name;
    if(type === 'DIRECT'){
      var splitName = name.split('+');
      var filterName = splitName.filter((name) => {
        return name !== currentUser;
      });
      directName = filterName[0] + '님과의 채팅';
    }
    return(
      <div className={styles.chatHeader}>
        {searchModal}
          <span className={styles.chatHeaderName} size='massive'><Icon name='comments outline'/>#{directName}</span>
          {this.props.isSearch?<Button icon='close' onClick={this.props.toggleSearch}/>:
            <div>
              <Dropdown compact pointing text={participants.length.toString()+'명'} button icon='group' labeled className='icon' >
                <Dropdown.Menu>
                  {this.props.participants.map((participant) => {
                    return(<Dropdown.Item key={participant} text={participant} />);
                  })}
                </Dropdown.Menu>
              </Dropdown>
              <Button compact icon color='black' onClick={this.props.toggleSearch}>
                <Icon name='search' />
              </Button>
              {outBtn}
            </div>}
        <Divider/>
      </div>
    );
  }
}
ChatHeader.propTypes = {
  name : PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
  id : PropTypes.string.isRequired,
  leaveChannel : PropTypes.func.isRequired,
  type : PropTypes.string.isRequired,
  currentUser : PropTypes.string.isRequired,
  toggleSearch : PropTypes.func.isRequired,
  isSearch : PropTypes.bool.isRequired,
};
ChatHeader.defaultProps = {
  name : '',
  participants : [],
  id : '',
  leaveChannel : () => console.log('props error(ChatHeader)'),
  type : 'CHANNEL',
  currentUser : '',
  toggleSearch : () => console.log('props error(ChatHeader)'),
  isSearch: false,
};
export default ChatHeader;
