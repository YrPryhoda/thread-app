import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Spinner from 'src/components/Spinner';
import { connect } from 'react-redux';
import PasswordResetForm from 'src/components/PasswordResetForm';
import { sendChangeProfileRequest } from '../Profile/actions';

const ResetPassword = ({
  user,
  match,
  sendChangeProfileRequest: sendNewPassword
}) => {
  if (user.passwordToken !== match.params.passwordToken) {
    return (<Redirect to="/" />);
  }
  const confirmNewPassword = async password => {
    const result = await sendNewPassword(password);
    return result ? (<Redirect to="/" />) : false;
  };
  return (
    !user ? (<Spinner />) : (
      <PasswordResetForm
        confirmNewPassword={confirmNewPassword}
      />
    )
  );
};

ResetPassword.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  sendChangeProfileRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.profile.user
});
const mapDispatchToProps = {
  sendChangeProfileRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
