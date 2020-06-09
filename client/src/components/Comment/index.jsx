import React from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const Comment = ({
  comment: { id, body, createdAt, user },
  deletePost,
  editPost,
  userId
}) => (
  <CommentUI className={styles.comment}>
    <CommentUI.Avatar src={getUserImgLink(user.image)} />
    <CommentUI.Content>
      <CommentUI.Author as="a">
        {user.username}
      </CommentUI.Author>
      <CommentUI.Metadata>
        {moment(createdAt).fromNow()}
      </CommentUI.Metadata>
      { user.status && (
        <CommentUI.Content>
          <CommentUI.Metadata>
            {user.status}
          </CommentUI.Metadata>
        </CommentUI.Content>
      )}
      <CommentUI.Text>
        {body}
      </CommentUI.Text>
      {
        user.id === userId
        && (
          <>
            <Label
              basic
              size="large"
              as="a"
              className={styles.right}
              onClick={() => deletePost(id, 'comment')}
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
    </CommentUI.Content>
  </CommentUI>
);

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  deletePost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

export default Comment;
