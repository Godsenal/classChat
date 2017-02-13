import axios from 'axios';

export const addPost = (type,post) => {
  return axios.post(`/api/post/${type}`,post)
          .then(resp => resp.data);
};

export const fetchCurrentList = () => {
  return axios.get('/api/post/home')
          .then(resp => resp.data.post);
};
export const fetchNoticeList = () => {
  return axios.get('/api/post/notices')
          .then(resp => resp.data.post);
};

export const fetchPostView = (postId) =>{
  return axios.get(`/api/post/${postId}`)
          .then(resp => resp.data.post);
};

export const deletePost = (postId) => {
  return axios.delete(`/api/post/${postId}`)
          .then(resp => resp.data);
};
