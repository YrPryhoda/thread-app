import userRepository from '../../data/repositories/userRepository';

export const getUserById = async userId => {
  const { id, username, email, status, imageId, image } = await userRepository.getUserById(userId);
  return { id, username, email, status, imageId, image };
};

export const updateUserStatusById = async (userId, data) => {
  const result = await userRepository.updateById(userId, data);
  return result;
};
