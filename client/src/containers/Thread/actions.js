import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  EDIT_POST,
  LOAD_EDITED_POST,
  SET_EXPANDED_POST
} from './actionTypes';

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
  console.log(id);
  if (id) {
    const newPost = await postService.getPost(id);
    console.log(newPost, '<<<< new post');
    dispatch(setExpandedPostAction(newPost));
  }
  dispatch(editPostAction(null));
};

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

export const dislikePost = postId => async (dispatch, getRootState) => {
  const { id, isLike, isDislike } = await postService.reactPostNegative(postId);
  const mapDislikes = post => {
    let diff;
    let diff2;
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
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapDislikes(post)));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapDislikes(expandedPost)));
  }
};

export const reactPost = postId => async (dispatch, getRootState) => {
  const { id, isLike, isDislike } = await postService.reactPost(postId);
  const mapLikes = post => {
    let diff;
    let diff2;
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
    return {
      ...post,
      likeCount: Number(post.likeCount) + diff,
      dislikeCount: Number(post.dislikeCount) + diff2
    };
  };
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapLikes(post)));

  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
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
