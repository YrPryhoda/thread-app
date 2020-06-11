import React from 'react';
import AddPost from 'src/components/AddPost';
import LikesList from 'src/components/LikesDescription';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';

import styles from './styles.module.scss';

const Post = ({
  post, reactPost, dislikePost,
  toggleExpandedPost, sharePost,
  userId, uploadImage, sendEditedPost,
  editPost, postToEdit, deletePost,
  onHover, onMouseHover
}) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    likers,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const date = moment(createdAt).fromNow();
  return postToEdit === id ? (
    <AddPost uploadImage={uploadImage} updatePost={sendEditedPost} post={post} />
  ) : (
    <Card
      style={{ width: '100%' }}
    >
      {image && <Image src={image.link} wrapped ui={false} />}
      <Card.Content>
        <Card.Meta>
          <span className="date">
            posted by
            {' '}
            {user.username}
            {' - '}
            {date}
          </span>
        </Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {onMouseHover.show && onMouseHover.postId === id && (<LikesList users={likers} />)}
        <Label
          basic
          size="small"
          as="a"
          className={styles.toolbarBtn}
          onClick={() => reactPost(id)}
        >
          <Icon name="thumbs up" />
          <span
            onMouseOver={e => onHover(e, id, true)}
            onMouseOut={e => onHover(e, id, false)}
            onFocus={e => onHover(e, id, true)}
            onBlur={e => onHover(e, id, false)}
          >
            {likeCount}
          </span>
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikePost(id)}>
          <Icon name="thumbs down" />
          {dislikeCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
          <Icon name="comment" />
          {commentCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
          <Icon name="share alternate" />
        </Label>
        {
          user.id === userId
          && (
            <>
              <Label
                basic
                size="large"
                as="a"
                className={styles.right}
                onClick={() => deletePost(id)}
              >
                <Icon name="eraser" />
              </Label>
              <Label
                basic
                size="large"
                as="a"
                className={styles.right}
                onClick={() => editPost(id)}
              >
                <Icon name="edit" />
              </Label>
            </>
          )
        }
      </Card.Content>
    </Card>
  );
};

Post.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  onMouseHover: PropTypes.objectOf(PropTypes.any),
  reactPost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  sendEditedPost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  postToEdit: PropTypes.string,
  editPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired
};

Post.defaultProps = {
  postToEdit: undefined,
  onMouseHover: {}
};

export default Post;
