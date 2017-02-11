import axios from 'axios';

export const addPost = (post) => {
  return axios.post('/api/notices',post)
          .then(resp => resp.data);
};

export const fetchNoticeList = () => {
  return axios.get('/api/notices')
          .then(resp => resp.data.post);
};
