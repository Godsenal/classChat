import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  add: {
    status: 'INIT',
    err: -1,
  },
  list: {
    status: 'INIT',
    posts: [],
    err: -1,
  },
  view: {
    status: 'INIT',
    post: {},
    err: -1,
  },
  edit: {
    status: 'INIT',
    err: -1,
  },
  delete: {
    status: 'INIT',
    err: -1,
  }
};

export default function post(state, action) {
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
        /* Post Add */
  case types.POST_ADD:
    return update(state, {
      add: {
        status: { $set: 'WAITING'}
      }
    });
  case types.POST_ADD_SUCCESS:
    return update(state, {
      add: {
        status: { $set: 'SUCCESS'}
      },
      list: {
        posts: { $set: [action.post, ...state.list.posts]}
      }
    });
  case types.POST_ADD_FAILURE:
    return update(state, {
      add: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err}
      }
    });

        /* Get Post List */
  case types.POST_LIST:
    return update(state, {
      list: {
        status: { $set: 'WAITING' }
      }
    });
  case types.POST_LIST_SUCCESS:
    return update(state, {
      list: {
        status: { $set: 'SUCCESS' },
        posts: { $set: action.posts }
      }
    });
  case types.POST_LIST_FAILURE:
    return update(state, {
      list: {
        status: { $set: 'FAILURE' }
      }
    });

        /* Get One Post */
  case types.POST_VIEW:
    return update(state, {
      view: {
        status: { $set: 'WAITING' }
      }
    });
  case types.POST_VIEW_SUCCESS:
    return update(state, {
      view: {
        status: { $set: 'SUCCESS' },
        post: { $set: action.post }
      }
    });
  case types.POST_VIEW_FAILURE:
    return update(state, {
      view: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err }
      }
    });

  case types.POST_EDIT:
    return update(state, {
      edit: {
        status: { $set: 'WAITING' }
      }
    });
  case types.POST_EDIT_SUCCESS:
    var editIndex = state.list.posts.indexOf({_id: action.postId});
    return update(state, {
      edit: {
        status: { $set: 'SUCCESS' }
      },
      view: {
        post: { $set: action.post }
      },
      list: {
        posts: {
          [editIndex]: { $set: action.post }
        }
      }
    });
  case types.POST_EDIT_FAILURE:
    return update(state, {
      view: {
        status: { $set: 'FAILURE' },
        err: { $set: action.err }
      }
    });

        /* Delete Post */
  case types.POST_DELETE:
    return update(state, {
      delete: {
        status: {$set: 'WAITING'}
      }
    });
  case types.POST_DELETE_SUCCESS:
    var deleteIndex = state.list.posts.indexOf({_id: action.postId});
    return update(state, {
      delete: {
        status: {$set: 'WAITING'}
      },
      list: {
        posts: {$splice: [[deleteIndex, 1]]
        }
      }
    });
  case types.POST_DELETE_FAILURE:
    return update(state, {
      delete: {
        status: {$set: 'WAITING'}
      }
    });
  default:
    return state;
  }
}
