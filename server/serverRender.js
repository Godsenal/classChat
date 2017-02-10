//fetch the data from the api
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/components/App';
import config from './config';
import axios from 'axios';

const getApiUrl = postId =>{
  if(postId){
    return `${config.serverUrl}/api/${postId}`;
  }
  return `${config.serverUrl}/api`;
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
const serverRender = (postId) =>
  axios.get(getApiUrl(postId))
    .then(resp => {
      const initialData = resp.data;
      return {
        initialMarkup:ReactDOMServer.renderToString(
          <App initialData={initialData}/>
        ),
        initialData
      };
    })
    .catch(error => {
      console.error(error);
    });

export default serverRender;
