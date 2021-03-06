import callWebApi from 'src/helpers/webApiHelper';

export const getAllPosts = async filter => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const addPost = async request => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'POST',
    request
  });
  return response.json();
};

export const editPost = async request => {
  const response = await callWebApi({
    endpoint: `/api/posts/edit/${request.id}`,
    type: 'PUT',
    request
  });
  return response.json();
};

export const getPost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const deletePost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/delete/${id}`,
    type: 'DELETE'
  });
  return response.json();
};

export const reactPost = async postId => {
  const response = await callWebApi({
    endpoint: '/api/posts/react',
    type: 'PUT',
    request: {
      postId,
      isLike: true
    }
  });
  return response.json();
};

export const reactPostNegative = async postId => {
  const response = await callWebApi({
    endpoint: '/api/posts/react-negative',
    type: 'PUT',
    request: {
      postId,
      isDislike: true
    }
  });
  return response.json();
};

export const getLikedUsers = async postId => {
  const response = await callWebApi({
    endpoint: `/api/posts/likers/${postId}`,
    type: 'GET'
  });
  return response.json();
};

// should be replaced by approppriate function
export const getPostByHash = async hash => getPost(hash);
