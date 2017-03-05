import {
  POST_ADD,
  POST_ADD_SUCCESS,
  POST_ADD_FAILURE,
  POST_LIST,
  POST_LIST_SUCCESS,
  POST_LIST_FAILURE,
  POST_VIEW,
  POST_VIEW_SUCCESS,
  POST_VIEW_FAILURE,
  POST_EDIT,
  POST_EDIT_SUCCESS,
  POST_EDIT_FAILURE,
  POST_DELETE,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
  POST_SEARCH,
  POST_SEARCH_SUCCESS,
  POST_SEARCH_FAILURE,
  COMMENT_CHANGE,
  COMMENT_CHANGE_SUCCESS,
  COMMENT_CHANGE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/* THUNK는 return 에서 다른 dispatch를 return하게 해줌으로써 비동기를 도와줌.
   예를 들어 dispatch하기전에 setTimeout을 쓴다던가.. */
export function addPost(type, post){
  return (dispatch) => {
    dispatch({type: POST_ADD});
    return axios.post(`/api/post/${type}`,post)
            .then((res) => {
              dispatch({type: POST_ADD_SUCCESS, post: res.data.post});
            }).catch((err) => {
              dispatch({type: POST_ADD_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}

export function listPost(type){
  return (dispatch) => {
    dispatch({type: POST_LIST});
    let url = '/api/post/home';

    if(type === 'notice')
      url = '/api/post/notice';

    return axios.get(url)
            .then((res) => {
              dispatch({type: POST_LIST_SUCCESS, posts: res.data.post});
            }).catch((err) => {
              dispatch({type: POST_LIST_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}

export const viewPost = (postId) => {
  return (dispatch) => {
    dispatch({type: POST_VIEW});

    return axios.get(`/api/post/${postId}`)
            .then((res) => {
              dispatch({type: POST_VIEW_SUCCESS, post: res.data.post});
            }).catch((err) => {
              dispatch({type: POST_VIEW_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
};

export const editPost = (postId, post) => {
  return (dispatch) => {
    dispatch({type: POST_EDIT});

    return axios.put(`/api/post/${postId}`,post)
      .then((res) => {
        dispatch({type: POST_EDIT_SUCCESS, post: res.data.post});
      }).catch((err) => {
        dispatch({type: POST_EDIT_FAILURE, err: err.response.data.error, code: err.response.data.code});
      });
  };
};

export const deletePost = (postId) => {
  return (dispatch) => {
    dispatch({type: POST_DELETE});
    return axios.delete(`/api/post/${postId}`)
            .then((res) => {
              dispatch({type: POST_DELETE_SUCCESS, postId});
            }).catch((err) => {
              dispatch({type: POST_DELETE_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
};

export const searchPost = (searchWord) => {
  return(dispatch) => {
    dispatch({type: POST_SEARCH});
    return axios.get(`/api/post/search/${searchWord}`)
            .then((res) => {
              dispatch({type: POST_SEARCH_SUCCESS, posts: res.data.posts});
            }).catch((err) => {
              dispatch({type: POST_SEARCH_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
};

/*** COMMENT ***/
export function addComment(postId, comment){
  return (dispatch) => {
    dispatch({type: COMMENT_CHANGE});
    return axios.post(`/api/comment/${postId}`,comment)
            .then((res) => {
              dispatch({type: COMMENT_CHANGE_SUCCESS, post: res.data.post});
            }).catch((err) => {
              dispatch({type:COMMENT_CHANGE_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
}
export const editComment = (postId, commentId, comment) => {
  return (dispatch) => {
    dispatch({type: COMMENT_CHANGE});

    return axios.put(`/api/comment/${postId}/${commentId}`, comment)
      .then((res) => {
        dispatch({type: COMMENT_CHANGE_SUCCESS, post: res.data.post});
      }).catch((err) => {
        dispatch({type: COMMENT_CHANGE_FAILURE, err: err.response.data.error, code: err.response.data.code});
      });
  };
};

export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    dispatch({type: COMMENT_CHANGE});
    return axios.delete(`/api/comment/${postId}/${commentId}`)
            .then((res) => {
              dispatch({type: COMMENT_CHANGE_SUCCESS, post: res.data.post});
            }).catch((err) => {
              dispatch({type: COMMENT_CHANGE_FAILURE, err: err.response.data.error, code: err.response.data.code});
            });
  };
};
