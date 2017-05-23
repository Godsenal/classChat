import React, { PropTypes } from 'react';
import {Button, Modal, Dropdown, Image, Form} from 'semantic-ui-react';
import NotificationSystem from 'react-notification-system';
import { MentionsInput, Mention } from 'react-mentions';
import mentionStyle from './mentionStyle';
import styles from '../Style.css';


class InputMessage extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      type : 'input', // filter로 자신을 걸러주고 object로 mapping
      selectOption : [],
      channelSelectOption: [],
      inviteSelectOption: [],
      selected:[],
      selectedMention:[],
      selectedChannel: '',
      selectedInvite: [],
      input:'',
      groupName: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleMentionChange = this.handleMentionChange.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  componentDidMount(){
    this.setState({
      selectOption: this.props.activeChannel.participants.filter((participant) => {
        if(participant !== this.props.currentUser){
          return participant;
        }
      }).map((participant, index) => {
        var option = {id: participant, display: participant, key : index, value : participant, text : participant};
        return option;
      }),
    });
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.activeChannel !== nextProps.activeChannel){ //participants 달라지면 옵션 업데이트.
      this.setState({
        selectOption: nextProps.activeChannel.participants.filter((participant) => {
          if(participant !== this.props.currentUser){
            return participant;
          }
        }).map((participant, index) => {
          var option = {id: participant, display: participant, key : index, value : participant, text : participant};
          return option;
        }),
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.state.selectedChannel !== '' && prevState.selectedChannel !== this.state.selectedChannel){
      let init =[];
      for(var i=0; i<this.props.channels.length; i++){
        if(this.props.channels[i].id === this.state.selectedChannel){
          init = this.props.channels[i].participants;
          break;
        }
      }
      var participants = [];

      init.forEach(function(key) {
        if (-1 === this.props.activeChannel.participants.indexOf(key)) {
          participants.push(key);
        }
      }, this); // 현재 채널에 없는 participants 만.

      this.setState({
        inviteSelectOption: participants.map((participant, index) => {
          var option = {id: participant, display: participant, key : index, value : participant, text : participant};
          return option;
        }),
      });
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
  handleChange(e, dropdown){
    if(dropdown){
      this.setState({[`${dropdown.name}`]: dropdown.value});
    }
    this.setState({[`${e.target.name}`]: e.target.value});

  }
  handleMentionChange(e, newValue, newPlainTextValue, mentions){
    let selectedMention = mentions.map((mention)=>{
      return mention.id;
    });
    this.setState({
      input: e.target.value,
      selectedMention
    });
  }
  handleKeyPress = (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if(!/\S/.test(this.state.input)){
        return;
      }
      if(this.state.selectedMention.length !== 0){
        this.props.handleMention(this.state.selectedMention);
      }

      this.props.addMessage(this.state.input);

      this.setState({
        input : '',
        selectedMention : [],
      });
    }

    if (e.metaKey && e.shiftKey && (e.key==='f' || e.key ==='F')) {
      e.preventDefault();
      this.props.toggleSearch();
    }
  }
  handleGroupClick = () => {
    this.setState({
      type : 'group',
    });
  }
  handleImageClick = () => {
    this.setState({type : 'image'});
  }
  handleFileClick = () => {
    this.file.click();
  }
  handleInviteClick = () => {
    this.setState({
      type : 'invite',
      channelSelectOption: this.props.channels.filter((channel) => {
        if(channel.type === 'CHANNEL'){
          return channel;
        }
      }).map((channel, index) => {
        var option = {id: channel.id, display: channel.name, key : index, value : channel.id, text : channel.name};
        return option;
      }),
    });
  }
  handleInit = () => {
    this.setState({
      type : 'input',
      inviteSelectOption: [],
      selected:[],
      selectedMention:[],
      selectedChannel: '',
      selectedInvite: [],
      input:'',
      groupName: '',
    });
  }
  handleDirectClick = () => {
    this.setState({
      type : 'direct',
    });
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
  selectedInvite = (e, data) =>{
    this.setState({
      selectedInvite: data.value,
    });
  }
  selectedChannel = (e, data) =>{
    this.setState({
      selectedChannel : data.value,
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
  handleInvite = () => {
    if(this.state.selectedInvite.length < 1){
      this.addNotification('초대할 사람을 선택해주세요.','warning','bc');
    }
    else{
      this.props.inviteChannel(this.props.activeChannel.id,this.state.selectedInvite);
      this.setState({
        selectedChannel: '',
        selectedInvite: [],
        type : 'input',
      });
    }

  }
  //<Select multiple selection search placeholder='그룹에 초대할 사람' options={participantsOptions} onChange={this.selectedItem}/>
  render () {
    const {type, selectOption, channelSelectOption, inviteSelectOption, groupName, input} = this.state;
    const {activeChannel} = this.props;
    const inputView =
      <div>
        <Dropdown color='black' style={{'position': 'absolute', 'zIndex': 100, 'height':40}} icon='plus' upward button className='icon'>
          <Dropdown.Menu >
            {activeChannel.type==='CHANNEL'?<Dropdown.Item icon='discussions' text='그룹만들기'onClick={this.handleGroupClick}/>: null}
            {activeChannel.type==='CHANNEL'|| activeChannel.type==='GROUP'?<Dropdown.Item icon='chat' text='1:1 채팅하기' onClick={this.handleDirectClick}/>:null}
            {activeChannel.type==='GROUP'?<Dropdown.Item icon='add user' text='초대하기' onClick={this.handleInviteClick}/>:null}
            <Dropdown.Item icon='file' text='이미지/파일 전송' onClick={this.handleFileClick}/>

          </Dropdown.Menu>
        </Dropdown>
        <input ref={ref => this.file=ref} type='file' style={{'display':'none'}} onChange={this.handleFile}/>
        <MentionsInput className={styles.messageInput}
                       markup='#[__display__]'
                       value={input}
                       style={mentionStyle}
                       onChange={this.handleMentionChange}
                       onKeyPress={this.handleKeyPress}>
            <Mention trigger="#"
                     type='user'
                     data={selectOption}
                     appendSpaceOnAdd={true}
                     renderSuggestion={ (entry, search, highlightedDisplay) => {
                       return(
                         <div >
                           {highlightedDisplay}
                         </div>);
                     }}/>
        </MentionsInput>

      </div>;

    const groupModal =
    <Modal open={type === 'group'} size='small' onClose={this.handleInit}>
      <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
        <span className={styles.logo}>
          <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
          <span style={{'float':'right','color':'#E74C3C'}}>그룹 만들기</span>
        </span>
      </Modal.Header>
        <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
          <Form className='attached fluid segment' style={{'textAlign':'left'}}>
            <Form.Input label='그룹명' fluid name='groupName' value={groupName} onChange={this.handleChange}/>
            <Form.Dropdown label='그룹에 초대할 사람' multiple selection fluid search placeholder='선택해주세요.' options={selectOption} onChange={this.selectedItem}/>
          </Form>
        </Modal.Content>
        <Modal.Actions style={{'backgroundColor':'#ECF0F1'}}>
          <Button primary basic type='submit' onClick={this.handleAddGroup}>그룹 생성</Button>
        </Modal.Actions>
      <NotificationSystem ref={ref => this.notificationSystem = ref} />
    </Modal>;
    const directModal =
    <Modal open={type === 'direct'} size='small' onClose={this.handleInit}>
      <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
        <span className={styles.logo}>
          <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
          <span style={{'float':'right','color':'#E74C3C'}}>1:1 채팅</span>
        </span>
      </Modal.Header>
      <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
        <Form className='attached fluid segment' style={{'textAlign':'left'}}>
          <Form.Dropdown label='1:1 채팅' multiple selection fluid search placeholder='상대를 선택해주세요.' options={selectOption} onChange={this.selectedItem}/>
        </Form>
      </Modal.Content>
      <Modal.Actions style={{'backgroundColor':'#ECF0F1'}}>
        <Button primary basic type='submit' onClick={this.handleAddDirect}>1:1 채팅 시작</Button>
      </Modal.Actions>
      <NotificationSystem ref={ref => this.notificationSystem = ref} />
    </Modal>;
    const inviteModal =
    <Modal open={type === 'invite'} size='small' onClose={this.handleInit}>
      <Modal.Header style={{'backgroundColor':'#2C3E50','color':'#ECF0F1'}}>
        <span className={styles.logo}>
          <Image size='mini' inline src='/assets/images/logo/favicon-96x96.png'/>클래스 챗
          <span style={{'float':'right','color':'#E74C3C'}}>그룹에 초대하기</span>
        </span>
      </Modal.Header>
      <Modal.Content style={{'backgroundColor':'#ECF0F1'}}>
        <Form className='attached fluid segment' style={{'textAlign':'left'}}>
          <Form.Dropdown label='채널 선택' placeholder='대상이 있는 채널을 선택해 주세요' fluid search selection options={channelSelectOption} onChange={this.selectedChannel}/>
          <Form.Dropdown label='대상 선택' placeholder='초대 대상을 선택해주세요' multiple fluid search selection options={inviteSelectOption} onChange={this.selectedInvite}/>
        </Form>
      </Modal.Content>
      <Modal.Actions style={{'backgroundColor':'#ECF0F1'}}>
        <Button primary basic type='submit' onClick={this.handleInvite}>초대</Button>
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
      <div className={styles.messageInputContainer} >
        {inputView}
        {groupModal}
        {directModal}
        {fileModal}
        {inviteModal}
      </div>
    );
  }
}
InputMessage.defaultProps = {
  activeChannel : {participant : []},
  addMessage : '',
  addGroup : ()=> {console.log('prop Error');},
  handleMention : () => {console.log('prop Error');},
  currentUser : '',
  isSearch : false,
  toggleSearch : () => {console.log('prop Error');},
};
InputMessage.propTypes ={
  activeChannel : PropTypes.object.isRequired,
  addMessage : PropTypes.func.isRequired,
  addGroup : PropTypes.func.isRequired,
  handleMention : PropTypes.func.isRequired,
  currentUser : PropTypes.string.isRequired,
  isSearch : PropTypes.bool.isRequired,
  toggleSearch : PropTypes.func.isRequired,
  channels : PropTypes.array.isRequired,
  inviteChannel: PropTypes.func.isRequired,
};

export default InputMessage;
