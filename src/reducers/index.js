import authentication from './authentication';
import post from './post';
import channel from './channel';
import message from './message';
import environment from './environment';

import { combineReducers } from 'redux';

export default combineReducers({
  authentication, post, channel, message, environment
});
