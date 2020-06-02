import commentRepository from '../../data/repositories/commentRepository';

export const create = (userId, comment) => commentRepository.create({
  ...comment,
  userId
});

export const getCommentById = id => commentRepository.getCommentById(id);

export const updateById = async (user, data) => {
  const { id, body } = data;
  const isOwner = await commentRepository.getCommentById(id);
  let postId;
  if (user === isOwner.userId) {
    const response = await commentRepository.updateById(id, { body });
    postId = response.postId;
  } else {
    postId = null;
  }
  return { id: postId };
};
export const deleteById = id => commentRepository.deleteById(id);

