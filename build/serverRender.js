'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _App = require('../src/components/App');

var _App2 = _interopRequireDefault(_App);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getApiUrl = function getApiUrl(postId) {
  if (postId) {
    return _config2.default.serverUrl + '/api/' + postId;
  }
  return _config2.default.serverUrl + '/api';
};
/*
const getInitialData = (contestId, apiData) => {
  if(contestId){
    return {
      currentContestId: apiData._id,
      contests: { // 지금 보여줄 하나의 contest만 보내줌.
        [apiData._id]: apiData
      }
    };
  }
  return {
    contests: apiData.contests
  };
};
*/
//fetch the data from the api
var serverRender = function serverRender(postId) {
  return _axios2.default.get(getApiUrl(postId)).then(function (resp) {
    var initialData = resp.data;
    return {
      initialMarkup: _server2.default.renderToString(_react2.default.createElement(_App2.default, { initialData: initialData })),
      initialData: initialData
    };
  }).catch(function (error) {
    console.error(error);
  });
};

exports.default = serverRender;