import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  Grid,
  Image,
  Input,
  Button
} from 'semantic-ui-react';
import { updateUsersStatus } from './actions';

const Profile = ({
  user,
  updateUsersStatus: updateStatus
}) => {
  const [status, setStatus] = useState(user.status || '');
  const onChange = e => setStatus(e.target.value);
  const changeStatus = e => {
    e.preventDefault();
    updateStatus(status);
  };
  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column>
        <Image centered src={getUserImgLink(user.image)} size="medium" circular />
        <br />
        <Input
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          disabled
          value={user.username}
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
          placeholder="Your status"
          type="text"
          value={status}
          onChange={e => onChange(e)}
        />
        <Button
          circular
          size="small"
          primary
          onClick={e => changeStatus(e)}
          content="OK"
        />
      </Grid.Column>
    </Grid>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  updateUsersStatus: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

const mapDispatchToProps = ({
  updateUsersStatus
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
