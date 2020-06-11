/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import SharedPostLink from 'src/components/SharedPostLink';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import ModalWindow from 'src/components/ModalConfirm';
import {
  defineEditedPost, deletePostById, deleteComment,
  loadPosts, loadMorePosts, toggleExpandedPost,
  addPost, sendEditedPost, dislikePost, reactPost,
  getUsersWhoLikesPost
} from './actions';

import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  showLiked: null,
  filterId: null,
  from: 0,
  count: 10
};

const Thread = ({
  userId,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts = [],
  expandedPost,
  deletePostById: deleteById,
  deleteComment: deleteCommentById,
  postToEdit,
  hasMorePosts,
  defineEditedPost: updatePost,
  sendEditedPost: editOwnPost,
  addPost: createPost,
  reactPost: react,
  dislikePost: dislike,
  toggleExpandedPost: toggle,
  getUsersWhoLikesPost: getUsersLikes
}) => {
  const [sharedPostId, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);
  const [hideOwnPosts, setHideOwnPosts] = useState(false);
  const [onMouseHover, setOnHover] = useState({
    postId: null,
    show: false
  });
  const [likedByMe, setLikedByMe] = useState(false);
  const [modalToDelete, setModalDelete] = useState({
    id: null,
    open: false,
    target: null
  });

  const deletePost = (id, target = 'post') => setModalDelete({
    id,
    open: true,
    target
  });

  const closeModal = () => setModalDelete({
    id: null,
    open: false,
    target: null
  });

  const sendDeleteRequest = (postId, target) => {
    if (target === 'post') {
      deleteById(postId);
    } else if (target === 'comment') {
      deleteCommentById(postId);
    }
    closeModal();
  };

  const toggleShowOwnPosts = () => {
    setHideOwnPosts(false);
    setLikedByMe(false);
    setShowOwnPosts(!showOwnPosts);
    postsFilter.userId = showOwnPosts ? undefined : userId;
    postsFilter.filterId = undefined;
    postsFilter.showLiked = undefined;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };
  const toggleHideOwnPost = () => {
    setShowOwnPosts(false);
    setLikedByMe(false);
    setHideOwnPosts(!hideOwnPosts);
    postsFilter.filterId = hideOwnPosts ? undefined : userId;
    postsFilter.userId = undefined;
    postsFilter.showLiked = undefined;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count;
  };
  const togglePostsLikedByMe = () => {
    setShowOwnPosts(false);
    setHideOwnPosts(false);
    setLikedByMe(!likedByMe);
    postsFilter.showLiked = likedByMe ? undefined : userId;
    postsFilter.userId = undefined;
    postsFilter.filterId = undefined;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count;
  };

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const sharePost = id => {
    setSharedPostId(id);
  };

  const editPost = id => {
    updatePost(id);
  };

  const onLikeBlockHover = postId => getUsersLikes(postId);

  function toggleLikeBlock(post, toggleTrigger) {
    if (!onMouseHover.show && toggleTrigger) {
      setOnHover({
        postId: post.id,
        show: true
      });
      if (!post.likers) {
        onLikeBlockHover(post.id);
      } else if (post.likers.length !== +post.likeCount) {
        onLikeBlockHover(post.id);
      }
    } else {
      setOnHover({
        postId: null,
        show: false
      });
    }
  }

  const uploadImage = file => imageService.uploadImage(file);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} uploadImage={uploadImage} />
      </div>
      <div className={styles.toolbar}>
        <Checkbox
          toggle
          label="Show my posts"
          checked={showOwnPosts}
          onChange={toggleShowOwnPosts}
        />
        <Checkbox
          toggle
          label="Hide my posts"
          checked={hideOwnPosts}
          onChange={toggleHideOwnPost}
        />
        <Checkbox
          toggle
          label="Liked by me"
          checked={likedByMe}
          onChange={togglePostsLikedByMe}
        />
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <Post
            userId={userId}
            post={post}
            reactPost={react}
            dislikePost={dislike}
            toggleExpandedPost={toggle}
            sharePost={sharePost}
            uploadImage={uploadImage}
            sendEditedPost={editOwnPost}
            editPost={editPost}
            postToEdit={postToEdit}
            deletePost={deletePost}
            key={post.id}
            onHover={toggleLikeBlock}
            onMouseHover={onMouseHover}
          />
        ))}
      </InfiniteScroll>
      {
        expandedPost
        && (
          <ExpandedPost
            userId={userId}
            sharePost={sharePost}
            uploadImage={uploadImage}
            sendEditedPost={editOwnPost}
            editPost={editPost}
            deletePost={deletePost}
            onHover={toggleLikeBlock}
            onMouseHover={onMouseHover}
          />
        )
      }
      {sharedPostId && <SharedPostLink postId={sharedPostId} close={() => setSharedPostId(undefined)} />}
      {
        modalToDelete.open
        && (
          <ModalWindow
            data={modalToDelete}
            confirmDelete={sendDeleteRequest}
            close={closeModal}
          />
        )
      }
    </div>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  userId: PropTypes.string,
  postToEdit: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  reactPost: PropTypes.func.isRequired,
  defineEditedPost: PropTypes.func.isRequired,
  sendEditedPost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  deletePostById: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  getUsersWhoLikesPost: PropTypes.func.isRequired
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  userId: undefined,
  postToEdit: undefined
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  userId: rootState.profile.user.id,
  postToEdit: rootState.posts.postToEdit
});

const actions = {
  loadPosts,
  loadMorePosts,
  reactPost,
  dislikePost,
  toggleExpandedPost,
  sendEditedPost,
  defineEditedPost,
  deletePostById,
  deleteComment,
  addPost,
  getUsersWhoLikesPost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
