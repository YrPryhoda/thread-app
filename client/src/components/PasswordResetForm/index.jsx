import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Grid
} from 'semantic-ui-react';
import './styles.scss';

const PasswordResetForm = ({
  confirmNewPassword
}) => {
  const [password, setPassword] = useState('');
  const onChange = e => setPassword(e.target.value);
  return (
    <Grid container textAlign="center" style={{ paddingTop: 130 }}>
      <Grid.Column>
        <Form onSubmit={() => confirmNewPassword(password)}>
          <Form.Field className="input-field">
            New password
            <input
              value={password}
              onChange={e => onChange(e)}
              name="newPassword"
              placeholder="create new password"
            />
          </Form.Field>
          <Button type="submit" color="blue"> Submit </Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

PasswordResetForm.propTypes = {
  confirmNewPassword: PropTypes.func.isRequired
};

export default PasswordResetForm;
