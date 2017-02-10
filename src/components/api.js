import axios from 'axios';

export const fetchPost = postId => {
  return axios.get(`/api/${postId}`)
          .then(resp => resp.data);
};

export const fetchNoticeList = () => {
  return axios.get('/api/notices')
          .then(resp => resp.data);
};
