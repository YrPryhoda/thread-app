import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  EDIT_POST,
  LOAD_EDITED_POST,
  SHOW_LIKES,
  SET_EXPANDED_POST
} from './actionTypes';

const showLikes = post => ({
  type: SHOW_LIKES,
  post
});

const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

const deletePostAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const editPostAction = postId => ({
  type: EDIT_POST,
  postId
});

const changePostAfterEdit = post => ({
  type: LOAD_EDITED_POST,
  post
});

const setExpandedPostAction = post => ({
  type: SET_EXPANDED_POST,
  post
});

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async dispatch => {
  const post = await postService.getPost(postId);
  dispatch(addPostAction(post));
};

export const getUsersWhoLikesPost = postId => async (dispatch, getRootState) => {
  const likers = await postService.getLikedUsers(postId);
  const { posts } = getRootState();
  const index = posts.posts.findIndex(el => el.id === postId);
  const newPost = { ...posts.posts[index], likers };
  const result = [
    ...posts.posts.slice(0, index),
    newPost,
    ...posts.posts.slice(index + 1)
  ];
  dispatch(showLikes(result));
  if (posts.expandedPost && posts.expandedPost.id === postId) {
    const expanded = { ...posts.expandedPost, likers };
    dispatch(setExpandedPostAction(expanded));
  }
};

export const addPost = post => async dispatch => {
  const { id } = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const defineEditedPost = id => dispatch => {
  dispatch(editPostAction(id));
};

export const sendEditedPost = (post, postId) => async (dispatch, getRootState) => {
  const { id } = await postService.editPost(post, postId);
  if (id) {
    const newPost = await postService.getPost(id);
    const { posts } = getRootState();
    const index = posts.posts.findIndex(el => el.id === id);
    const result = [
      ...posts.posts.slice(0, index),
      newPost,
      ...posts.posts.slice(index + 1)
    ];
    dispatch(changePostAfterEdit(result));
    if (posts.expandedPost && posts.expandedPost.id === id) {
      dispatch(setExpandedPostAction(newPost));
    }
  }
  dispatch(editPostAction(null));
};

export const updatePostsComment = comment => async dispatch => {
  const { id } = await commentService.updateComment(comment);
  if (id) {
    const newPost = await postService.getPost(id);
    dispatch(setExpandedPostAction(newPost));
  }
  dispatch(editPostAction(null));
};

export const sendSharedPost = (email, link) => commentService.sendMail(email, link);

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedPostAction(post));
};

export const deletePostById = postId => async (dispatch, getRootState) => {
  try {
    const { result } = await postService.deletePost(postId);
    if (Number(result)) {
      const { posts: { posts, expandedPost } } = getRootState();
      const newPosts = posts.filter(el => el.id !== postId);
      dispatch(deletePostAction(newPosts));
      if (expandedPost && expandedPost.id === postId) {
        dispatch(setExpandedPostAction(undefined));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const deleteComment = commentId => async (dispatch, getRootState) => {
  try {
    const { result } = await commentService.deleteComment(commentId);
    if (Number(result)) {
      const { posts: { posts, expandedPost } } = getRootState();
      const newPost = await postService.getPost(expandedPost.id);
      const index = posts.findIndex(el => el.id === newPost.id);
      const updatePosts = [
        ...posts.slice(0, index),
        newPost,
        ...posts.slice(index + 1)
      ];
      dispatch(setExpandedPostAction(newPost));
      dispatch(setPostsAction(updatePosts));
    }
  } catch (error) {
    console.log(error);
  }
};

const mapDislikes = (post, reacted) => {
  let diff;
  let diff2;
  const { id, isLike, isDislike } = reacted;
  switch (true) {
    case !id && !isLike:
      diff = -1;
      diff2 = 0;
      break;
    case !id && isLike:
      diff = 1;
      diff2 = -1;
      break;
    case id && isDislike && !isLike:
      diff = 1;
      diff2 = 0;
      break;
    case id && isDislike && isLike:
      diff = 1;
      diff2 = -1;
      break;
    default: break;
  }
  return {
    ...post,
    dislikeCount: Number(post.dislikeCount) + diff,
    likeCount: Number(post.likeCount) + diff2
  };
};

const mapLikes = (post, reacted, type = 'post') => {
  let diff;
  let diff2;
  const { id, isLike, isDislike } = reacted;
  switch (true) {
    case !id && !isDislike:
      diff = -1;
      diff2 = 0;
      break;
    case !id && isDislike:
      diff = 1;
      diff2 = -1;
      break;
    case id && isLike && !isDislike:
      diff = 1;
      diff2 = 0;
      break;
    case id && isLike && isDislike:
      diff = 1;
      diff2 = -1;
      break;
    default: break;
  }
  return type === 'post' ? {
    ...post,
    likeCount: Number(post.likeCount) + diff,
    dislikeCount: Number(post.dislikeCount) + diff2
  } : {
    ...post,
    comments: {
      ...post.comments,
      likeCount: Number(post.likeCount) + diff,
      dislikeCount: Number(post.dislikeCount) + diff2
    }
  };
};

export const dislikePost = postId => async (dispatch, getRootState) => {
  const reacted = await postService.reactPostNegative(postId);
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapDislikes(post, reacted)));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapDislikes(expandedPost, reacted)));
  }
};

export const reactPost = postId => async (dispatch, getRootState) => {
  const reacted = await postService.reactPost(postId);
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapLikes(post, reacted)));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost, reacted)));
  }
};

export const reactComment = commentId => async (dispatch, getRootState) => {
  const reacted = await commentService.reactComment(commentId);
  console.log(reacted);
  const { posts: { expandedPost } } = getRootState();
  if (expandedPost && expandedPost.comments.id === commentId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost, reacted)));
  }
};

export const addComment = request => async (dispatch, getRootState) => {
  const { id } = await commentService.addComment(request);
  const comment = await commentService.getComment(id);

  const mapComments = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments || []), comment] // comment is taken from the current closure
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== comment.postId
    ? post
    : mapComments(post)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === comment.postId) {
    dispatch(setExpandedPostAction(mapComments(expandedPost)));
  }
};
