import userRepository from '../../data/repositories/userRepository';
import { sendMail } from '../../helpers/emailHelper';
import { createToken } from '../../helpers/tokenHelper';
import { encrypt } from '../../helpers/cryptoHelper';

export const getUserById = async userId => {
  const { id, username, email, status, imageId, image, passwordToken } = await userRepository.getUserById(userId);
  return { id, username, email, status, imageId, image, passwordToken };
};

export const updateUserStatusById = async (userId, data) => {
  await userRepository.updateById(userId, data);
  const result = await userRepository.getUserById(userId);
  return result;
};

export const sendEmail = async id => {
  const passwordToken = createToken({ id });
  await userRepository.updateById(id, { passwordToken });
  const { email } = await userRepository.getUserById(id);
  const result = await sendMail(email, passwordToken);
  return result;
};

export const setNewPassword = async (userId, password) => {
  const passHash = await encrypt(password.password);
  const result = await userRepository.updateById(userId, { password: passHash, passwordToken: null });
  return result;
};
