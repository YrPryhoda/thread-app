import postRepository from '../../data/repositories/postRepository';
import postReactionRepository from '../../data/repositories/postReactionRepository';

export const getPosts = filter => postRepository.getPosts(filter);

export const getPostById = id => postRepository.getPostById(id);

export const create = (userId, post) => postRepository.create({
  ...post,
  userId
});

export const deleteById = id => postRepository.deleteById(id);

export const editPostById = async (userId, newPost) => {
  const { id, body } = newPost;
  const post = await getPostById(id);
  let result;
  if (post.user.id === userId) {
    await postRepository.updateById(id, { body });
    result = { id };
  } else {
    result = { id: null };
  }
  return result;
};

export const setReaction = async (userId, { postId, isLike }) => {
  const reaction = await postReactionRepository.getPostReaction(userId, postId);
  const updateOrDelete = react => (react.isLike === isLike
    ? postReactionRepository.deleteById(react.id)
    : postReactionRepository.updateById(react.id, { isLike, isDislike: false }));
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
        ...postReactionRepository.getPostReaction(userId, postId),
        isDislike: justify
      };
    }
  } else {
    await postReactionRepository.create({ userId, postId, isLike, isDislike: false });
    sendBack = postReactionRepository.getPostReaction(userId, postId);
  }
  return sendBack;
};

export const setReactionDislike = async (userId, { postId, isDislike }) => {
  // define the callback for future use as a promise
  const reaction = await postReactionRepository.getPostReaction(userId, postId);
  const updateOrDelete = react => (react.isDislike === isDislike
    ? postReactionRepository.deleteById(react.id)
    : postReactionRepository.updateById(react.id, { isDislike, isLike: false }));
  let result;
  let justify;
  let sendBack;
  if (reaction) {
    justify = reaction.isLike;
    result = await updateOrDelete(reaction);
    if (Number.isInteger(result)) {
      sendBack = {
        isLike: justify
      };
    } else {
      sendBack = {
        ...postReactionRepository.getPostReaction(userId, postId),
        isLike: justify
      };
    }
  } else {
    await postReactionRepository.create({ userId, postId, isDislike, isLike: false });
    sendBack = postReactionRepository.getPostReaction(userId, postId);
  }
  return sendBack;
};
