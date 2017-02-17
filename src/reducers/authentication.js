import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  signin: {
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  signup: {
    status: 'INIT',
    err: 'ERROR',
    errCode: -1,
  },
  status: {
    err: 'ERROR',
    errCode: -1,
    valid: false,
    isSignedIn: false,
    isAdmin: false,
    currentUser: '',
    currentUserNickname: '',
  },
};


export default function authentication(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
        /* LOGIN */
  case types.AUTH_SIGNIN:
    return update(state, {
      signin: {
        status: { $set: 'WAITING '}
      }
    });
  case types.AUTH_SIGNIN_SUCCESS:
    return update(state, {
      signin: {
        status: { $set: 'SUCCESS' }
      },
      status: {
        isSignedIn: { $set: true },
        isAdmin: { $set: action.isAdmin},
        currentUser: { $set: action.id },
        currentUserNickname: { $set: action.nickname}
      }
    });
  case types.AUTH_SIGNIN_FAILURE:
    return update(state, {
      signin: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err},
        errCode: { $set: action.code}
      }
    });

        /* REGISTER */
  case types.AUTH_SIGNUP:
    return update(state, {
      signup: {
        status: { $set: 'WAITING' }
      }
    });
  case types.AUTH_SIGNUP_SUCCESS:
    return update(state, {
      signup: {
        status: { $set: 'SUCCESS' },
      }
    });
  case types.AUTH_SIGNUP_FAILURE:
    return update(state, {
      signup: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err },
        errCode: { $set: action.code}
      }
    });

        /* getinfo */
  case types.AUTH_GET_STATUS:
    return update(state, {
      status: {
        isSignedIn: { $set: true }
      }
    });
  case types.AUTH_GET_STATUS_SUCCESS:
    return update(state, {
      status: {
        valid: { $set: true },
        isAdmin: { $set: action.isAdmin},
        currentUser: { $set: action.id },
        currentUserNickname: { $set: action.nickname}
      }
    });
  case types.AUTH_GET_STATUS_FAILURE:
    return update(state, {
      status: {
        valid: { $set: false },
        isAdmin:{ $set: false},
        isSignedIn: { $set: false },
        err: { $set: action.err}
      }
    });

        /* logout */
  case types.AUTH_SIGNOUT:
    return update(state, {
      status: {
        isAdmin:{ $set: false},
        isSignedIn: { $set: false },
        currentUser: { $set: '' },
        currentUserNickname: { $set: ''}
      }
    });
  default:
    return state;
  }
}
