import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  Grid,
  Image,
  Input,
  Icon,
  Button
} from 'semantic-ui-react';
import * as imageService from 'src/services/imageService';
import styles from 'src/components/AddPost/styles.module.scss';
import { updatePersonalField } from './actions';

const Profile = ({
  user,
  updatePersonalField: updateField
}) => {
  const [data, setData] = useState({
    status: user.status || '',
    username: user.username,
    usernameFieldProtect: true,
    iconUsername: 'edit'
  });
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState({
    loading: false,
    sendButton: false
  });
  useEffect(() => {
    getUserImgLink(user.image);
  }, [user.image]);
  const onChange = e => setData({
    ...data,
    [e.target.name]: e.target.value
  });
  const changeField = (e, object) => {
    e.preventDefault();
    updateField(object);
  };
  const stateTemplate = object => {
    setData({ ...data, ...object });
  };
  const openField = e => {
    if (data.usernameFieldProtect) {
      stateTemplate({
        usernameFieldProtect: false,
        iconUsername: 'check'
      });
    } else {
      changeField(e, { username: data.username });
      stateTemplate({
        usernameFieldProtect: true,
        iconUsername: 'edit'
      });
    }
  };
  const uploadImage = file => imageService.uploadImage(file);
  const handleUploadFile = async ({ target }) => {
    setIsUploading({ sendButton: false, loading: true });
    try {
      const { id: imageId, link: imageLink } = await uploadImage(target.files[0]);
      setImage({ imageId, imageLink });
      setIsUploading({ loading: true, sendButton: false });
    } finally {
      setIsUploading({ sendButton: true, loading: false });
    }
  };
  const updateAvatar = async () => {
    await updateField({ imageId: image.imageId });
    setImage(undefined);
  };

  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column>
        <Image centered src={getUserImgLink(user.image)} size="medium" circular />
        <br />
        <br />
        {image?.imageLink && (
          <div className={styles.imageWrapper}>
            <Image className={styles.profileImage} src={image?.imageLink} alt="post" />
          </div>
        )}
        <Button
          color="teal"
          icon
          labelPosition="left"
          as="label"
          loading={isUploading.loading}
          disabled={isUploading.loading}
        >
          <Icon name="image" />
          Change profile photo
          <input name="image" type="file" onChange={handleUploadFile} hidden />
        </Button>
        {
          image?.imageId && (
            <Button
              color="teal"
              icon
              labelPosition="left"
              disabled={!isUploading.sendButton}
              onClick={updateAvatar}
            >
              <Icon name="check" />
              Confirm
            </Button>
          )
        }
        <br />
        <br />
        <Input
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          disabled={data.usernameFieldProtect}
          name="username"
          value={data.username}
          onChange={e => onChange(e)}
        />
        <Button
          circular
          icon={data.iconUsername}
          color="orange"
          onClick={e => openField(e)}
        />
        <br />
        <br />
        <Input
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          disabled
          value={user.email}
        />
        <br />
        <br />
        <Input
          icon="pencil alternate"
          iconPosition="left"
          name="status"
          placeholder="Your status"
          type="text"
          value={data.status}
          onChange={e => onChange(e)}
        />
        <Button
          circular
          size="small"
          primary
          onClick={e => changeField(e, { status: data.status })}
          icon="check"
        />
      </Grid.Column>
    </Grid>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  updatePersonalField: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

const mapDispatchToProps = ({
  updatePersonalField
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
