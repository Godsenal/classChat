import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  isMobile: false,
  screenHeight: null,
  screenWidth: null,
  notification: {
    message: '',
    level: 'success',
    position: 'bc',
    autoDismiss: 3,
    uuid: '0',
  },
};

export default function environment(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
  case types.CHANGE_IS_MOBILE:
    return {
      ...state, isMobile: action.isMobile
    };

  case types.CHANGE_WIDTH_AND_HEIGHT:
    return {
      ...state, screenHeight: action.screenHeight, screenWidth: action.screenWidth
    };
    /* ADD NEW NOTIFICATION  */
  case types.NOTIFICATION_ADD:
    return update(state,{
      notification: {$merge: action.notification},
    });
  default:
    return state;
  }
}
