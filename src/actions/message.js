import {
    MESSAGE_ADD,
    MESSAGE_ADD_SUCCESS,
    MESSAGE_ADD_FAILURE,
    MESSAGE_LIST,
    MESSAGE_LIST_SUCCESS,
    MESSAGE_LIST_FAILURE,
    MESSAGE_FILTER,
    MESSAGE_FILTER_SUCCESS,
    MESSAGE_FILTER_FAILURE,
    MESSAGE_SEARCH,
    MESSAGE_SEARCH_SUCCESS,
    MESSAGE_SEARCH_FAILURE,
    ROW_MESSAGE_RECEIVE,
    RECEIVE_MESSAGE_DELETE,
    LASTDATEID_MESSAGE_DELETE,
    RESET_MESSAGE_FILTER
} from './ActionTypes';

import axios from 'axios';

/* NOT REQUIRED FETCH ACTION */


export function receiveRawMessage(message, isActive = false) {
  return {
    type: ROW_MESSAGE_RECEIVE,
    message,
    isActive
  };
}
export function deleteReceiveMessage(channelID) {
  return {
    type: RECEIVE_MESSAGE_DELETE,
    channelID
  };
}
export function deleteLastDateID(channelID) {
  return {
    type: LASTDATEID_MESSAGE_DELETE,
    channelID
  };
}
export function resetFilter(){
  return {
    type: RESET_MESSAGE_FILTER,
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
    var messageCopy = message;
    var data = message;
    let url = '/api/message/new_message';
    if(typeof message.contents !== 'string'){
      let type = message.types.split('/')[0];
      data = new FormData();
      data.append('files', message.contents);
      data.append('contents',message.contents.name);
      data.append('id',message.id);
      data.append('channelID',message.channelID);
      data.append('userName',message.userName);
      data.append('created',message.created);
      data.append('types',message.types);
      url = `/api/message/new_message/${type}`;

      messageCopy.contents = message.contents.name;
      messageCopy.types = type;
    }
    dispatch({type: MESSAGE_ADD, message: messageCopy});
    return axios.post(url, data)
            .then((res) => {
              dispatch({type: MESSAGE_ADD_SUCCESS, message: res.data.message});
            }).catch((err) => {
              dispatch({type: MESSAGE_ADD_FAILURE, err: err.res.data.error, code: err.res.data.code});
            });
  };
}


/* LIST MESSAGE */

export function listMessage(channelID, isInitial, topMessageID = '-1') {
  return (dispatch) => {
    dispatch({type: MESSAGE_LIST});
    if(!isInitial && (topMessageID === '-1')){
      return dispatch({type: MESSAGE_LIST_SUCCESS, channelID, isInitial, topMessageID});
    }

    let url = `api/message/list/${channelID}/${topMessageID}`;
    if(isInitial&&(topMessageID !== '-1')){ // 처음불러오는건데, topMessageID 가 -1이 아닐때.(Date로 불러올 때)
      url = `api/message/listdate/${channelID}/${topMessageID}`;
    }
    return axios.get(url)
            .then((res) => {
              dispatch({type: MESSAGE_LIST_SUCCESS, messages: res.data.messages, channelID, isInitial, topMessageID, lastDateID: res.data.lastDateID});
            }).catch((err) => {
              dispatch({type: MESSAGE_LIST_FAILURE, err: err.res.data.error, code: err.res.data.code});
            });
  };
}

/* FILTER MESSAGE */
export function filterMessage(channelID, types = 'message', topMessageID = '-1', searchWord) {
  return (dispatch) => {
    dispatch({type: MESSAGE_FILTER});
    var messageID = topMessageID;
    return axios.get(`api/message/filter/${channelID}/${messageID}/${types}/${searchWord}`)
            .then((res) => {
              dispatch({type: MESSAGE_FILTER_SUCCESS, messages: res.data.messages, topMessageID: topMessageID, types, searchWord});
            }).catch((err) => {
              dispatch({type: MESSAGE_FILTER_FAILURE, err: err.res.data.error, code: err.res.data.code});
            });
  };
}

/* SEARCH MESSAGE */
