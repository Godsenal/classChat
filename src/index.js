import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import {App, Home, ListView, PostView, Signin, Signup, SearchView} from './containers';

import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk)); // thunk가 mapDispatchToProps 할 때, 인자를 전달 할 수 있게 도와줌.

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="signin" component={Signin} />
        <Route path="signup" component={Signup} />
        <Route path="search" component={SearchView} />
        <Route path="notice" component={ListView} />
        <Route path=":postId" component={PostView} />
      </Route>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
