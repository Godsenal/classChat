import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Notice from './components/Notice';


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="notice" component={Notice}/>
    </Route>
  </Router>
  ,
  document.getElementById('root')
);
