import callWebApi from 'src/helpers/webApiHelper';

export const login = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/login',
    type: 'POST',
    request
  });
  return response.json();
};

export const registration = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/register',
    type: 'POST',
    request
  });
  return response.json();
};

export const editPassword = async () => {
  const response = await callWebApi({
    endpoint: '/api/auth/reset',
    type: 'GET'
  });
  return response.json();
};

export const changePassword = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/reset-password',
    type: 'PUT',
    request
  });
  return response.json();
};

export const getCurrentUser = async () => {
  try {
    const response = await callWebApi({
      endpoint: '/api/auth/user',
      type: 'GET'
    });
    return response.json();
  } catch (e) {
    return null;
  }
};

export const updateProdileField = async request => {
  try {
    const response = await callWebApi({
      endpoint: '/api/auth/user',
      type: 'POST',
      request
    });
    return response.json();
  } catch (e) {
    console.log(e);
    return null;
  }
};
