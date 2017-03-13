import {
    MESSAGE_ADD,
    MESSAGE_ADD_SUCCESS,
    MESSAGE_ADD_FAILURE,
    MESSAGE_LIST,
    MESSAGE_LIST_SUCCESS,
    MESSAGE_LIST_FAILURE,
    ROW_MESSAGE_RECEIVE,
} from './ActionTypes';

import axios from 'axios';

/* NOT REQUIRED FETCH ACTION */


export function receiveRawMessage(message) {
  console.log(message);
  return {
    type: ROW_MESSAGE_RECEIVE,
    message
  };
}


/*
export function typing(username) {
  return {
    type: types.TYPING,
    username
  };
}

export function stopTyping(username) {
  return {
    type: types.STOP_TYPING,
    username
  };
}

export function changeChannel(channel) {
  return {
    type: types.CHANGE_CHANNEL,
    channel
  };
}
*/
/* ADD MESSAGE */
export function addMessage(message) {
  return (dispatch) => {
    dispatch({type: MESSAGE_ADD});
    return axios.post('/api/message/new_message', message)
            .then((res) => {
              dispatch({type: MESSAGE_ADD_SUCCESS, message: res.data.message});
            }).catch((err) => {
              dispatch({type: MESSAGE_ADD_FAILURE, err: err.res.data.error, code: err.res.data.code});
            });
  };
}

/* LIST MESSAGE */

export function listMessage(channelID) {
  return (dispatch) => {
    dispatch({type: MESSAGE_LIST});
    return axios.get(`api/message/${channelID}`)
            .then((res) => {
              dispatch({type: MESSAGE_LIST_SUCCESS, messages: res.data.messages});
            }).catch((err) => {
              dispatch({type: MESSAGE_LIST_FAILURE, err: err.res.data.error});
            });
  };
}
