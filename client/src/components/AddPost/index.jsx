import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment } from 'semantic-ui-react';

import styles from './styles.module.scss';

const AddPost = ({
  addPost,
  updatePost,
  uploadImage,
  post
}) => {
  const [body, setBody] = useState(post ? post.body : '');
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPost = async () => {
    if (!body) {
      return;
    }
    if (post && post.id) {
      await updatePost({ id: post.id, imageId: image?.imageId, body });
    } else {
      await addPost({ imageId: image?.imageId, body });
    }
    setBody('');
    setImage(undefined);
  };

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      const { id: imageId, link: imageLink } = await uploadImage(target.files[0]);
      setImage({ imageId, imageLink });
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };

  return (
    <Segment>
      <Form onSubmit={handleAddPost}>
        <Form.TextArea
          name="body"
          value={body}
          placeholder="What is the news?"
          onChange={ev => setBody(ev.target.value)}
        />
        {image?.imageLink && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={image?.imageLink} alt="post" />
          </div>
        )}
        <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
          <Icon name="image" />
          Attach image
          <input name="image" type="file" onChange={handleUploadFile} hidden />
        </Button>
        <Button floated="right" color="blue" type="submit">Post</Button>
      </Form>
    </Segment>
  );
};
AddPost.defaultProps = {
  addPost: undefined,
  updatePost: undefined
};

AddPost.propTypes = {
  addPost: PropTypes.func,
  updatePost: PropTypes.func,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  uploadImage: PropTypes.func.isRequired
};

export default AddPost;
