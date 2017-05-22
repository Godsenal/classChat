import authentication from './authentication';
import channel from './channel';
import message from './message';
import environment from './environment';

import { combineReducers } from 'redux';

export default combineReducers({
  authentication, channel, message, environment
});
