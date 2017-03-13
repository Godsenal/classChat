import {
    AUTH_SIGNIN,
    AUTH_SIGNIN_SUCCESS,
    AUTH_SIGNIN_FAILURE,
    AUTH_SIGNUP,
    AUTH_SIGNUP_SUCCESS,
    AUTH_SIGNUP_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_SIGNOUT,
    AUTH_SOCKET_RECEIVE,
} from './ActionTypes';

import { browserHistory } from 'react-router';
import axios from 'axios';

/* dispatch안에는 action 객체가 들어가고 state 는 redux에서 알아서 관리
   err말고 error을 쓰는 이유는, 기본 err과 겹치는 것을  피하기 위해 */

export function signinRequest(id, password) {
  return (dispatch) => {
    dispatch({type: AUTH_SIGNIN});

    return axios.post('/api/account/signin', { id, password })
            .then((res) => {
              dispatch({type: AUTH_SIGNIN_SUCCESS, id, nickname: res.data.nickname, isAdmin: res.data.isAdmin });
            }).catch((err) => {
              dispatch({type: AUTH_SIGNIN_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}


/* REGISTER */
export function signupRequest(id, password, nickname) {
  return (dispatch) => {
    dispatch({type: AUTH_SIGNUP});
    return axios.post('/api/account/signup', { id, password, nickname })
            .then((res) => {
              dispatch({type: AUTH_SIGNUP_SUCCESS});
            }).catch((err) => {
              dispatch({type: AUTH_SIGNUP_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}

/* GET STATUS */

export function getStatusRequest() {
  return (dispatch) => {
    dispatch({type: AUTH_GET_STATUS});
    return axios.get('/api/account/getinfo')
            .then((res) => {
              dispatch({type: AUTH_GET_STATUS_SUCCESS, id: res.data.info.id, nickname: res.data.info.nickname, isAdmin: res.data.info.isAdmin});
            }).catch((err) => {
              dispatch({type: AUTH_GET_STATUS_FAILURE, err: err.response.data.error});
            });
  };
}

/* LOGOUT */
export function signoutRequest() {
  return (dispatch) => {
    return axios.post('/api/account/signout')
            .then((res) => {
              if(res.data.success){
                browserHistory.push('/');
              }
              dispatch({type: AUTH_SIGNOUT});
            });
  };
}

export function receiveSocket(socketID) {
  return {
    type: AUTH_SOCKET_RECEIVE,
    socketID
  };
}
