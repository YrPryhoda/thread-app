import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import { reactPost, dislikePost, toggleExpandedPost, addComment } from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';

const ExpandedPost = ({
  userId,
  post,
  sharePost,
  reactPost: react,
  dislikePost: dislike,
  toggleExpandedPost: toggle,
  addComment: add,
  uploadImage,
  sendEditedPost,
  editPost,
  postToEdit
}) => {
  const [editedPost, setEditedPost] = useState(post);
  useEffect(() => {
    setEditedPost(post);
  }, [post]);
  return (
    <Modal dimmer="blurring" centered={false} open onClose={() => toggle()}>
      {post
        ? (
          <Modal.Content>
            <Post
              userId={userId}
              post={editedPost}
              reactPost={react}
              dislikePost={dislike}
              toggleExpandedPost={toggle}
              sharePost={sharePost}
              uploadImage={uploadImage}
              sendEditedPost={sendEditedPost}
              editPost={editPost}
              postToEdit={postToEdit}
            />
            <CommentUI.Group style={{ maxWidth: '100%' }}>
              <Header as="h3" dividing>
                Comments
              </Header>
              {post.comments && post.comments
                .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
                .map(comment => <Comment key={comment.id} comment={comment} />)}
              <AddComment postId={post.id} addComment={add} />
            </CommentUI.Group>
          </Modal.Content>
        )
        : <Spinner />}
    </Modal>
  );
};

ExpandedPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  reactPost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  postToEdit: PropTypes.func,
  uploadImage: PropTypes.func.isRequired,
  sendEditedPost: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

ExpandedPost.defaultProps = {
  postToEdit: undefined
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedPost,
  userId: rootState.profile.user.id,
  postToEdit: rootState.posts.postToEdit

});

const actions = { reactPost, dislikePost, toggleExpandedPost, addComment };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
