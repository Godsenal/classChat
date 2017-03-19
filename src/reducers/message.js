import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';
import _ from 'lodash';

const initialState = {
  add:{
    status: 'INIT',
    message: {},
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    messages: [],
    lastIndex: 0,
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
    if(matchIndex < 0){
      let newData = {
        id : action.message.id,
        date : new Date(action.message.created).setHours(0,0,0,0),
        messages : [action.message]
      };
      return update(state, {
        add: {
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
        add: {
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
  case types.MESSAGE_ADD:
    return update(state, {
      add: {
        status: { $set: 'WAITING'}
      }
    });
  case types.MESSAGE_ADD_SUCCESS:
    var matchAddIndex = -1;
    state.list.messages.map((message,i)=>{
      if(message.date === new Date(action.message.created).setHours(0,0,0,0))
        matchAddIndex = i;
    });

    if(matchAddIndex < 0){
      let newData = {
        id : action.message.id,
        date : new Date(action.message.created).setHours(0,0,0,0),
        messages : [action.message]
      };
      return update(state, {
        add: {
          status: { $set: 'SUCCESS' },
          message: { $set: action.message}
        },
        list: {
          messages: { $push: [newData]}
        }
      });
    }
    else{
      return update(state, {
        add: {
          status: { $set: 'SUCCESS' },
          message: { $set: action.message}
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
  case types.MESSAGE_ADD_FAILURE:
    return update(state, {
      add: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err},
        errCode: { $set: action.code}
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
          messages: { $set: divByDate }
        }
      });
    }else{ //old메시지 인데 list에 이미 같은날짜의 데이터가 있으면 넣어주고 old메시지는 삭제.
      if(divByDate[divByDate.length -1].date === state.list.messages[0].date){
        divByDate[divByDate.length -1].messages.push(...state.list.messages[0].messages);
        console.log(divByDate[divByDate.length -1]);
        state = update(state,{
          list:{
            messages:{
              [0]:{
                $set : divByDate[divByDate.length-1]
              }
            }
          }
        });
        divByDate.pop();
      }
      return update(state, {
        list: {
          status: { $set: 'SUCCESS' },
          messages: { $unshift: divByDate }
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
