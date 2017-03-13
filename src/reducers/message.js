import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  add:{
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  list: {
    status: 'INIT',
    messages: [],
    err: 'ERROR',
    errCode: -1,
  },
};

export default function message(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
        /* ADD CHANNEL */
  case types.ROW_MESSAGE_RECEIVE:
    return update(state, {
      list: {
        messages: {$set: [...state.list.messages,action.message]}
      },
    });
  case types.MESSAGE_ADD:
    return update(state, {
      add: {
        status: { $set: 'WAITING'}
      }
    });
  case types.MESSAGE_ADD_SUCCESS:
    return update(state, {
      add: {
        status: { $set: 'SUCCESS' },
      },
      list: {
        messages: {$set: [...state.list.messages,action.message]}
      }
    });
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
    return update(state, {
      list: {
        status: { $set: 'SUCCESS' },
        messages: { $set: action.messages }
      }
    });
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
