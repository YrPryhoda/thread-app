import commentRepository from '../../data/repositories/commentRepository';
import commentReactionRepository from '../../data/repositories/commentReactionRepository';

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

export const setReaction = async (userId, { commentId, isLike }) => {
  const reaction = await commentReactionRepository.getCommentReaction(userId, commentId);
  const updateOrDelete = react => (react.isLike === isLike
    ? commentReactionRepository.deleteById(react.id)
    : commentReactionRepository.updateById(react.id, { isLike, isDislike: false }));
  let result;
  let justify;
  let sendBack;
  if (reaction) {
    justify = reaction.isDislike;
    result = await updateOrDelete(reaction);
    if (Number.isInteger(result)) {
      sendBack = {
        isDislike: justify
      };
    } else {
      sendBack = {
        ...commentReactionRepository.getCommentReaction(userId, commentId),
        isDislike: justify
      };
    }
  } else {
    await commentReactionRepository.create({ userId, commentId, isLike, isDislike: false });
    sendBack = commentReactionRepository.getCommentReaction(userId, commentId);
  }
  return sendBack;
};

export const deleteById = id => commentRepository.deleteById(id);

