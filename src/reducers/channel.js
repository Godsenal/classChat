import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  activeChannel: {
    _id: '',
    name: 'public',
    id: '1',
    private: false,
    participants: [],
  },
  receive:{
    status: 'INIT',
    channel: {},
  },
  add:{
    status: 'INIT',
    channel: {},
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    channels: [],
    err: 'ERROR',
    errCode: -1,
  },
  join: {
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  leave: {
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  search: {
    status: 'INIT',
    results: [],
    err: 'ERROR',
    errCode: -1,
  },
};

export default function channel(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
        /*Receive CHANNEL*/
  case types.ROW_CHANNEL_RECEIVE:
    var channelIndex = state.list.channels.findIndex((channel)=> channel.id === action.channel.id);
    if(channelIndex >=0){ //이미 존재할 경우
      return state;
    }
    return update(state, {
      receive: {
        status : {$set: 'SUCCESS'},
        channel : {$set: action.channel}
      },
      list: {
        channels: {$set: [...state.list.channels,action.channel]}
      }
    });
        /* RECEIVE PARTICIPANT */
  case types.ROW_PARTICIPANT_RECEIVE:

    var participantIndex = state.activeChannel.participants.indexOf(action.participant);
    var listIndex = state.list.channels.findIndex((channel) => {
      return channel.id === action.channelID;
    });
    if(listIndex <0){
      return state;
    }
    if(!action.isLeave){ //들어올 때 추가하기위해 이미 있는지 파악(있으면 그냥 return)
      if(participantIndex >= 0){
        return state;
      }
      return update(state, {
        activeChannel: {
          participants: {$push : [action.participant]}
        },
        list: {
          channels:{
            [listIndex]:{
              participants: {$push : [action.participant]}
            }
          }
        }
      });
    }
    else{ //나갈때 제거하기 위해 이미 있는지 파악(없으면 그냥 return)
      if(participantIndex < 0){
        return state;
      }
      return update(state, {
        activeChannel: {
          participants: {$splice : [[participantIndex,1]]}
        },
        list: {
          channels:{
            [listIndex]:{
              participants: {$splice : [[participantIndex,1]]}
            }
          }
        }
      });
    }
        /* ADD CHANNEL */
  case types.CHANNEL_ADD:
    return update(state, {
      add: {
        status: { $set: 'WAITING'}
      }
    });
  case types.CHANNEL_ADD_SUCCESS:
    return update(state, {
      add: {
        status: { $set: 'SUCCESS' },
        channel: { $set: action.channel},
      },
      list: {
        channels: {$set: [...state.list.channels,action.channel]}
      }
    });
  case types.CHANNEL_ADD_FAILURE:
    return update(state, {
      add: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err},
        errCode: { $set: action.code}
      }
    });

        /* LIST CHANNEL */
  case types.CHANNEL_LIST:
    return update(state, {
      list: {
        status: { $set: 'WAITING' }
      }
    });
  case types.CHANNEL_LIST_SUCCESS:
    return update(state, {
      list: {
        status: { $set: 'SUCCESS' },
        channels: { $set: action.channels }
      }
    });
  case types.CHANNEL_LIST_FAILURE:
    return update(state, {
      list: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err },
        errCode: { $set: action.code}
      }
    });
      /* CHANNEL JOIN */
  case types.CHANNEL_JOIN:
    return update(state, {
      join: {
        status: { $set: 'WAITING' },
      }
    });
  case types.CHANNEL_JOIN_SUCCESS:
    return update(state, {
      join: {
        status: { $set: 'SUCCESS' }
      }
    });
  case types.CHANNEL_JOIN_FAILURE:
    return update(state, {
      join: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err },
        errCode: { $set: action.code}
      }
    });

      /* CHANNEL LEAVE */
  case types.CHANNEL_LEAVE:
    return update(state, {
      leave: {
        status: { $set: 'WAITING' },
      }
    });
  case types.CHANNEL_LEAVE_SUCCESS:
    var removeIndex = state.list.channels.findIndex((channel)=>{
      return channel.id === action.channel.id;
    });
    if(removeIndex < 0){
      return state;
    }
    return update(state, {
      leave: {
        status: { $set: 'SUCCESS' }
      },
      list: {
        channels: { $splice: [[removeIndex, 1]]}
      },
    });
  case types.CHANNEL_LEAVE_FAILURE:
    return update(state, {
      leave: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err },
        errCode: { $set: action.code}
      }
    });

        /* CHAGNE CHANNEL */
  case types.CHANNEL_CHANGE:
    return update(state, {
      activeChannel: { $set: action.channel }
    });
    /* SEARCH CHANNEL */
  case types.CHANNEL_SEARCH:
    return update(state, {
      search: {
        status: {$set: 'WAITING'}
      }
    });
  case types.CHANNEL_SEARCH_SUCCESS:
    return update(state, {
      search: {
        status: {$set: 'SUCCESS'},
        results: {$set: action.channels},
      }
    });
  case types.CHANNEL_SEARCH_FAILURE:
    return update(state, {
      search: {
        status: {$set: 'FAILURE'},
        results: {$set: []}
      },
    });
  default:
    return state;
  }
}
