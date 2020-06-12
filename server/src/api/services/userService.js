import userRepository from '../../data/repositories/userRepository';

export const getUserById = async userId => {
  const { id, username, email, status, imageId, image } = await userRepository.getUserById(userId);
  return { id, username, email, status, imageId, image };
};

export const updateUserStatusById = async (userId, data) => {
  await userRepository.updateById(userId, data);
  const result = await userRepository.getUserById(userId);
  return result;
};
