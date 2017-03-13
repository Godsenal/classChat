import {
    CHANNEL_ADD,
    CHANNEL_ADD_SUCCESS,
    CHANNEL_ADD_FAILURE,
    CHANNEL_LIST,
    CHANNEL_LIST_SUCCESS,
    CHANNEL_LIST_FAILURE,
    CHANNEL_JOIN,
    CHANNEL_JOIN_SUCCESS,
    CHANNEL_JOIN_FAILURE,
    CHANNEL_CHANGE,
    CHANNEL_SEARCH,
    CHANNEL_SEARCH_SUCCESS,
    CHANNEL_SEARCH_FAILURE,
    ROW_CHANNEL_RECEIVE,
} from './ActionTypes';

import axios from 'axios';

/* NOT REQUIRED FETCH ACTION */
export function receiveRawChannel(channel) {
  return {
    type: ROW_CHANNEL_RECEIVE,
    channel
  };
}

/* ADD CHANNEL */
export function addChannel(channel) {
  return (dispatch) => {
    dispatch({type: CHANNEL_ADD});
    return axios.post('/api/channel/new_channel', channel)
            .then((res) => {
              dispatch({type: CHANNEL_ADD_SUCCESS, channel: res.data.channel});
            }).catch((err) => {
              dispatch({type: CHANNEL_ADD_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}

/* JOIN CHANNEL */
export  function joinChannel(userName, channels){
  return (dispatch) => {
    dispatch({type: CHANNEL_JOIN});
    return axios.put(`api/channel/join/${userName}`,channels)
            .then((res)=>{
              dispatch({type: CHANNEL_JOIN_SUCCESS});
            }).catch((err)=> {
              dispatch({type: CHANNEL_JOIN_FAILURE, err: err.response.data.error});
            });
  };
}

/* LIST CHANNEL */

export function listChannel(userName) {
  return (dispatch) => {
    dispatch({type: CHANNEL_LIST});
    return axios.get(`api/channel/${userName}`)
            .then((res) => {
              dispatch({type: CHANNEL_LIST_SUCCESS, channels: res.data.channels});
            }).catch((err) => {
              dispatch({type: CHANNEL_LIST_FAILURE, err: err.response.data.error});
            });
  };
}

/* CHANGE CURRENT CHANNEL */

export function changeChannel(channel){
  return {
    type: CHANNEL_CHANGE,
    channel
  };
}

/* SEARCH CHANNEL */

export function searchChannel(channelName){
  return (dispatch) => {
    dispatch({type: CHANNEL_SEARCH});
    return axios.get(`api/channel/search/${channelName}`)
            .then((res)=>{
              dispatch({type: CHANNEL_SEARCH_SUCCESS, channels: res.data.channels});
            }).catch((err) => {
              dispatch({type: CHANNEL_SEARCH_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}
