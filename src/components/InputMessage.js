import React, { PropTypes } from 'react';
import {Button, Icon, Select, Input, Modal} from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';

import styles from '../Style.css';

class InputMessage extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      type : 'input', // filter로 자신을 걸러주고 object로 mapping
      selectOption : this.props.activeChannel.participants.filter((participant,index) => {
        if(participant !== this.props.currentUser){
          return participant;
        }
      }).map((participant, index) => {
        var option = {key : index, value : participant, text : participant};
        return option;
      }),
      selected:[],
      input:'',
      groupName: '',
    };
    this.handleKeyPress= this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  componentWillReceiveProps(nextProps){ // participant 가 새로 추가되었을 때 바로 변경.
    if(this.state.selectOption.length !== nextProps.activeChannel.participants.length)
      this.setState({selectOption : nextProps.activeChannel.participants.filter((participant,index) => {
        if(participant !== this.props.currentUser){
          return participant;
        }
      }).map((participant, index) => {
        var option = {key : index, value : participant, text : participant};
        return option;
      }),});
  }
  addNotification(message, level, position) {
    this.notificationSystem.addNotification({
      message,
      level,
      position,
      autoDismiss: 2,
    });
  }
  handleChange(e){
    this.setState({[`${e.target.name}`]: e.target.value});
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.props.addMessage(this.state.input);
      this.setState({input : ''});
    }
  }
  handleGroupClick = () => {
    this.setState({type : 'group'});
  }
  handleImageClick = () => {
    this.setState({type : 'image'});
  }
  handleFileClick = () => {
    this.setState({type : 'file'});
  }
  handleInit = () => {
    this.setState({type : 'input'});
  }
  selectedItem = (e, data) =>{
    this.setState({
      selected : data.value,
    });
  }
  handleAddGroup = () => {
    var stringRegx=/^[0-9a-zA-Z가-힝]*$/;
    if(!stringRegx.test(this.state.groupName)){
      this.addNotification('그룹명은 한글,영문,숫자의 조합으로만 가능합니다.','error','bc');
      this.setState({
        groupName : '',
      });
    }else if(this.state.selected.length <= 1){
      this.addNotification('그룹원은 최소 자신포함 3명 이상이어야 합니다.','warning','bc');
    }else{
      var group ={
        name: this.state.groupName,
        participants : [this.props.currentUser,...this.state.selected],
        type : 'GROUP',
      };
      this.props.addGroup(group);
      this.setState({
        groupName : '',
        selected : [],
        type : 'input',
      });
    }
  }
  //<Select multiple selection search placeholder='그룹에 초대할 사람' options={participantsOptions} onChange={this.selectedItem}/>
  render () {
    const {type, selectOption, groupName, input} = this.state;
    const inputView =
      <div>
        <Button.Group floated='left'>
          <Button icon='group' onClick={this.handleGroupClick}/>
          <Button icon='image' onClick={this.handleImageClick}/>
          <Button icon='file text outline' onClick={this.handleFileClick}/>
        </Button.Group>
        <textArea className={styles.messageInput} name='input' value={input} type ='text' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
      </div>;
    const groupModal =
    <Modal open={type === 'group'} size='small' onClose={this.handleInit}>
      <Modal.Header>그룹 추가</Modal.Header>
      <Modal.Content>
        <Input label='그룹명' fluid name='grouName' value={groupName} onChange={this.handleChange}/>
        <Modal.Description>
          <Select multiple selection fluid search placeholder='그룹에 초대할 사람' options={selectOption} onChange={this.selectedItem}/>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={this.handleAddGroup}>그룹 만들기</Button>
      </Modal.Actions>
      <NotificationSystem ref={ref => this.notificationSystem = ref} />
    </Modal>;
    return(
      <div className={styles.messageInputContainer}>
        {inputView}
        {groupModal}
      </div>
    );
  }
}
InputMessage.propTypes ={
  addMessage : PropTypes.func.isRequired,
};

export default InputMessage;
