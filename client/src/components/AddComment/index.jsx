import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

const AddComment = ({
  postId,
  addComment,
  updateComment,
  comment
}) => {
  const [body, setBody] = useState('');
  useEffect(() => {
    if (comment.body) setBody(comment.body);
  }, [comment.body]);
  const handleAddComment = async () => {
    if (!body) {
      return;
    }
    if (comment && comment.id) {
      await updateComment({
        id: comment.id,
        body
      });
    } else {
      await addComment({ postId, body });
    }
    setBody('');
  };
  return (
    <Form reply onSubmit={handleAddComment}>
      <Form.TextArea
        value={body}
        placeholder="Type a comment..."
        onChange={ev => setBody(ev.target.value)}
      />
      <Button type="submit" content="Post comment" labelPosition="left" icon="edit" primary />
    </Form>
  );
};

AddComment.propTypes = {
  addComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  updateComment: PropTypes.func,
  comment: PropTypes.objectOf(PropTypes.any)
};

AddComment.defaultProps = {
  updateComment: undefined,
  comment: {}
};

export default AddComment;
