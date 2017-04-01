import React, { PropTypes } from 'react';
import {Button, Select, Input, Modal} from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import styles from '../Style.css';

class InputMessage extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      type : 'input', // filter로 자신을 걸러주고 object로 mapping
      selectOption : this.props.activeChannel.participants.filter((participant) => {
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
  componentWillReceiveProps(nextProps){ // participant가 새로 추가되었을 때 바로 변경. +1은 자기자신 제외한거 다시 더한거.
    if(this.state.selectOption.length+1 !== nextProps.activeChannel.participants.length){
      this.setState({selectOption : nextProps.activeChannel.participants.filter((participant) => {
        if(participant !== this.props.currentUser){
          return participant;
        }
      }).map((participant, index) => {
        var option = {key : index, value : participant, text : participant};
        return option;
      }),});
    }
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
  handleDirectClick = () => {
    this.setState({type : 'direct'});
  }
  handleFile = (e) => {
    e.preventDefault();
    this.props.addMessage(e.target.files[0]);
    this.setState({file : e.target.files[0]});
  }
  selectedItem = (e, data) =>{
    this.setState({
      selected : data.value,
    });
  }
  handleAddDirect = () => {
    var sortParticipants = [this.props.currentUser, this.state.selected].sort();
    var group ={
      name: (sortParticipants[0] + '+' + sortParticipants[1]),
      participants : sortParticipants,
      type : 'DIRECT',
    };
    this.props.addGroup(group);
    this.setState({
      selected : [],
      type : 'input',
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
          <Button icon='user' onClick={this.handleDirectClick}/>
          <Button icon='group' onClick={this.handleGroupClick}/>
          <Button icon='image' onClick={this.handleImageClick}/>
          <label htmlFor="file" className="ui icon button">
            <i className="file icon"></i></label>
          <input type="file" id="file" style={{'display':'none'}} onChange={this.handleFile}/>
        </Button.Group>
        <textArea className={styles.messageInput} name='input' value={input} type ='file' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
      </div>;
    const groupModal =
    <Modal open={type === 'group'} size='small' onClose={this.handleInit}>
      <Modal.Header>그룹 추가</Modal.Header>
      <Modal.Content>
        <Input label='그룹명' fluid name='groupName' value={groupName} onChange={this.handleChange}/>
        <Modal.Description>
          <Select multiple selection fluid search placeholder='그룹에 초대할 사람' options={selectOption} onChange={this.selectedItem}/>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={this.handleAddGroup}>그룹 만들기</Button>
      </Modal.Actions>
      <NotificationSystem ref={ref => this.notificationSystem = ref} />
    </Modal>;
    const directModal =
    <Modal open={type === 'direct'} size='small' onClose={this.handleInit}>
      <Modal.Header>1:1채팅 추가</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Select selection fluid search placeholder='1:1채팅 상대' options={selectOption} onChange={this.selectedItem}/>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={this.handleAddDirect}>1:1채팅 만들기</Button>
      </Modal.Actions>
      <NotificationSystem ref={ref => this.notificationSystem = ref} />
    </Modal>;
    const fileModal =
    <Modal open={type === 'file'} size='small' onClose={this.handleInit}>
      <Modal.Header>1:1채팅 추가</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
            <input ref="file" type="file" name="file" className={styles.messageInput}/>
          </form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={this.handleAddDirect}>1:1채팅 만들기</Button>
      </Modal.Actions>
      <NotificationSystem ref={ref => this.notificationSystem = ref} />
    </Modal>;
    return(
      <div className={styles.messageInputContainer}>
        {inputView}
        {groupModal}
        {directModal}
        {fileModal}
      </div>
    );
  }
}
InputMessage.defaultProps = {
  activeChannel : {participant : []},
  addMessage : '',
  addGroup : ()=> {console.log('prop Error');},
  currentUser : '',
};
InputMessage.propTypes ={
  activeChannel : PropTypes.object.isRequired,
  addMessage : PropTypes.func.isRequired,
  addGroup : PropTypes.func.isRequired,
  currentUser : PropTypes.string.isRequired,
};

export default InputMessage;
