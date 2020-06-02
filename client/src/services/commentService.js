import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/comments',
    type: 'POST',
    request
  });
  return response.json();
};

export const getComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const updateComment = async request => {
  const response = await callWebApi({
    endpoint: `/api/comments/edit/${request.id}`,
    type: 'PUT',
    request
  });
  return response.json();
};

export const deleteComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/comments/delete/${id}`,
    type: 'DELETE'
  });
  return response.json();
};
