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
    AUTH_SIGNOUT
} from './ActionTypes';

import axios from 'axios';

export function signinRequest(id, password) {
  return (dispatch) => {
    dispatch({type: AUTH_SIGNIN});

    return axios.post('/api/account/signin', { id, password })
            .then((res) => {
              dispatch({type: AUTH_SIGNIN_SUCCESS, id, nickname: res.data.nickname});
            }).catch((err) => {
              dispatch({type: AUTH_SIGNIN_FAILURE, err});
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
              dispatch({type: AUTH_SIGNUP_FAILURE,err});
            });
  };
}

/* GET STATUS */

export function getStatusRequest() {
  return (dispatch) => {
    dispatch({type: AUTH_GET_STATUS});
    return axios.get('/api/account/getinfo')
            .then((res) => {
              dispatch({type: AUTH_GET_STATUS_SUCCESS, id: res.data.info.id, nickname: res.data.info.nickname});
            }).catch((err) => {
              dispatch({type: AUTH_GET_STATUS_FAILURE,err});
            });
  };
}

/* LOGOUT */
export function signoutRequest() {
  return (dispatch) => {
    return axios.post('/api/account/signout')
            .then((res) => {
              dispatch({type: AUTH_SIGNOUT});
            });
  };
}
