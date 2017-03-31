import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';
import _ from 'lodash';

const initialState = {
  receive:{
    status: 'INIT',
    message: {},
  },
  add:{
    status: 'INIT',
    message: {},
    waitingMessages: [],
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    messages: [],
    isLast : false,
    err: 'ERROR',
    errCode: -1,
  },
};

export default function message(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
        /* Recieve Message in Client*/
  case types.ROW_MESSAGE_RECEIVE:
    //효율적이게 뒤에서 찾아보도록 생각해볼 것.
    var matchIndex = -1;
    state.list.messages.map((message,i)=>{
      if(message.date === new Date(action.message.created).setHours(0,0,0,0))
        matchIndex = i;
    });
    /* //이미 있는지 확인(socket 해결되면 뺄것)
    var alreadyMatchIndex = state.list.messages[matchIndex].messages.findIndex((message)=>{return message.id===action.message.id;});
    if(alreadyMatchIndex >= 0){
      return state;
    }*/
    if(matchIndex < 0){
      let newData = {
        id : action.message.id,
        date : new Date(action.message.created).setHours(0,0,0,0),
        messages : [action.message]
      };
      return update(state, {
        receive: {
          status: { $set: 'SUCCESS' },
          message: { $set: action.message}
        },
        list: {
          messages: {$push: [newData]}
        }
      });
    }
    else{
      return update(state, {
        receive: {
          status: { $set: 'SUCCESS' },
          message: { $set: action.message}
        },
        list: {
          messages: {
            [matchIndex]: {
              id:{
                $set: [action.message.id]
              },
              date:{
                $set: new Date(action.message.created).setHours(0,0,0,0)
              },
              messages:{
                $push: [action.message]
              }
            }
          }
        }
      });
    }
  case types.MESSAGE_ADD: // 보내는 사람은 데이터에 등록되기전에 먼저 보기 위해서.
    var matchAddIndex = -1;
    state.list.messages.map((message,i)=>{ // 현재 메시지랑 날짜가 같은 Date Object를 찾음.
      if(message.date === new Date(action.message.created).setHours(0,0,0,0))
        matchAddIndex = i;
    });
    action.message.isWaiting = true; //서버에 저장된게 아직 아니므로 waiting.
    if(matchAddIndex < 0){ // Match되는게 없을 경우 push함.

      let newData = {
        id : action.message.id,
        date : new Date(action.message.created).setHours(0,0,0,0),
        messages : [action.message]
      };
      return update(state, {
        add: {
          status: { $set: 'WAITING' },
          message: { $set: action.message},
          waitingMessages: { $push: [{dateIndex: state.list.messages.length, messageIndex: 0}]}
        }, // 새로 push들어가는 메시지이기 때문에 date group에서의 위치는 제일 마지막. messageIndex는 처음 들어가는 것이기 때문에 0
        list: {
          messages: { $push: [newData]}
        }
      });
    }
    else{
      return update(state, {
        add: {
          status: { $set: 'WAITING' },
          message: { $set: action.message},
          waitingMessages: { $push: [{dateIndex: matchAddIndex, messageIndex: state.list.messages[matchAddIndex].messages.length}]}
        },
        list: {
          messages: {
            [matchAddIndex]: {
              id:{
                $set: [action.message.id]
              },
              date:{
                $set: new Date(action.message.created).setHours(0,0,0,0)
              },
              messages:{
                $push: [action.message]
              }
            }
          }
        }
      });
    }
  case types.MESSAGE_ADD_SUCCESS:
    var waitingMessage = state.add.waitingMessages.shift();
    var dateIndex = waitingMessage.dateIndex;
    var messageIndex = waitingMessage.messageIndex;
    return update(state, {
      add: {
        status: { $set: 'SUCCESS'},
        message: { $set: action.message},
      },
      list: {
        messages: {
          [dateIndex]:{
            messages:{
              [messageIndex]:{
                $set: action.message
              }
            }
          }
        }
      }
    });
  case types.MESSAGE_ADD_FAILURE:
    var waitingMessageFailure = state.add.waitingMessages.shift();
    var dateIndexFailure = waitingMessageFailure.dateIndex;
    var messageIndexFailure = waitingMessageFailure.messageIndex;
    return update(state, {
      add: {
        status: { $set: 'SUCCESS'}
      },
      list: {
        messages: {
          [dateIndexFailure]:{
            messages:{
              $splice: [[messageIndexFailure,1]]
            }
          }
        }
      }
    });

        /* LIST CHANNEL */
  case types.MESSAGE_LIST:
    return update(state, {
      list: {
        status: { $set: 'WAITING' }
      }
    });
  case types.MESSAGE_LIST_SUCCESS:

    var divByDate = [];
    var divided = {};
    action.messages.map((message) => { // message의 date를 비교해서 date,id,messages를 가지고있는 array를 만듬.
      if(!_.isEmpty(divided) && (divided.date!==new Date(message.created).setHours(0,0,0,0))){
        divByDate.push(divided);
        divided = {};
      }

      if(_.isEmpty(divided)){
        divided = {
          id: message.id,
          date : new Date(message.created).setHours(0,0,0,0),
          messages : [message]
        };
      }
      else{
        divided.id = message.id;
        divided.messages.unshift(message);
      }
    });
    //마지막 메시지들은 날짜가 다른지 비교를 못하므로 따로 처리
    if(!_.isEmpty(divided))
      divByDate.push(divided);

    if(action.isInitial){ // 첫 데이터 불러오기면 그냥 set
      divByDate.reverse();
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          messages: { $set: divByDate },
          isLast: { $set: action.messages.length < 30}
        }
      });
    }else{ //old메시지 인데 list에 이미 같은날짜의 데이터가 있으면 넣어주고 old메시지는 삭제.
      if(divByDate[0].date === state.list.messages[0].date){
        divByDate[0].messages.push(...state.list.messages[0].messages);
        state = update(state,{
          list:{
            messages:{
              [0]:{
                $set : divByDate[0]
              }
            }
          }
        });
        divByDate.shift();
      }
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          messages: { $unshift: divByDate },
          isLast: { $set: action.messages.length < 30}
        }
      });
    }
  case types.MESSAGE_LIST_FAILURE:
    return update(state, {
      list: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err },
        errCode: { $set: action.code}
      }
    });
  default:
    return state;
  }
}
