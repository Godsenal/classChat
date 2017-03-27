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
    CHANNEL_LEAVE,
    CHANNEL_LEAVE_SUCCESS,
    CHANNEL_LEAVE_FAILURE,
    CHANNEL_CHANGE,
    CHANNEL_SEARCH,
    CHANNEL_SEARCH_SUCCESS,
    CHANNEL_SEARCH_FAILURE,
    ROW_CHANNEL_RECEIVE,
    ROW_PARTICIPANT_RECEIVE,
} from './ActionTypes';

import axios from 'axios';

/* NOT REQUIRED FETCH ACTION */
/* RECEIVE MESSAGE */
export function receiveRawChannel(channel) {
  return {
    type: ROW_CHANNEL_RECEIVE,
    channel
  };
}

/* RECEIVE PARTICIPANTS */
export function receiveRawParticipant(channelID, participant ,isLeave = false){
  return {
    type : ROW_PARTICIPANT_RECEIVE,
    channelID,
    participant,
    isLeave
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
export  function joinChannel(channels, userName){ // channel ID의 Array
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

/* LEAVE CHANNEL */
export  function leaveChannel(channelID, userName){
  return (dispatch) => {
    dispatch({type: CHANNEL_LEAVE});
    return axios.put(`api/channel/leave/${userName}`,{channelID})
            .then((res)=>{
              dispatch({type: CHANNEL_LEAVE_SUCCESS, channel : res.data.channel, isRemoved: res.data.isRemoved});
            }).catch((err)=> {
              dispatch({type: CHANNEL_LEAVE_FAILURE, err: err.data.error, code: err.data.code});
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
