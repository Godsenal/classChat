import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import {App, Home, ListView, PostView, Signin, Signup, SearchView, Chat, ImageView} from './containers';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk)); // thunk가 mapDispatchToProps 할 때, 인자를 전달 할 수 있게 도와줌.

/* 필요할까
var Authentication = (nextState, replace, callback) => {
  function getCookie(name){
    var value = '; '+ document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }
  let signinData = getCookie('key');

      // if loginData is undefined, do nothing
  if(typeof signinData === 'undefined'){
    replace('/');
  }

      // decode base64 & parse json
  signinData = JSON.parse(atob(signinData));
      // if not logged in, do nothing
  if(!signinData.isSignedIn){
    replace('/');
  }

  axios.get('/api/account/getinfo')
    .then((res) => {
      if(res.data != '') {
        replace('/channel');
        callback();
      }
    })
    .catch((err) => {
      replace('/');
      callback();
    });
  callback();
};
*/
ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App} >
          <Route path="signup" component={Signup} />
          <IndexRoute component={Home} />
          <Route path="signin" component={Signin} />
          <Route path="search" component={SearchView} />
          <Route path="notice" component={ListView} />
          <Route path="channel" component={Chat}>
            <Route path=":channelName" component={Chat} />
          </Route>
          <Route path="image/:url/:name" component={ImageView} />
          <Route path=":postId" component={PostView} />
        </Route>
      </Router>
  </Provider>
  ,
  document.getElementById('root')
);
