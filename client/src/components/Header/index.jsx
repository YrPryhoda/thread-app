import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Input, Button } from 'semantic-ui-react';

import styles from './styles.module.scss';

const Header = ({ user, logout, updatePersonalField }) => {
  const [status, setStatus] = useState(user.status || '');
  const [isEditStatus, setIsEdit] = useState(false);
  const onChange = e => setStatus(e.target.value);
  const changeStatus = () => {
    updatePersonalField({ status });
    setIsEdit(false);
  };
  return (
    <div className={styles.headerWrp}>
      <Grid centered container columns="2">
        <Grid.Column>
          {user && (
            <NavLink exact to="/">
              <HeaderUI>
                <Image circular src={getUserImgLink(user.image)} />
                <HeaderUI.Content>
                  {user.username}
                  {
                    isEditStatus ? (
                      <HeaderUI.Subheader>
                        <Input
                          size="mini"
                          icon="pencil alternate"
                          iconPosition="left"
                          placeholder="Your status"
                          type="text"
                          value={status}
                          onChange={e => onChange(e)}
                        />
                        <Button
                          basic
                          size="small"
                          compact
                          onClick={changeStatus}
                          content="OK"
                        />
                      </HeaderUI.Subheader>
                    ) : (
                      <HeaderUI.Subheader>
                        {user.status}
                        {' '}
                        <Button
                          basic
                          compact
                          icon="edit"
                          size="tiny"
                          onClick={() => setIsEdit(true)}
                        />
                      </HeaderUI.Subheader>
                    )
                  }
                </HeaderUI.Content>
              </HeaderUI>
            </NavLink>
          )}
        </Grid.Column>
        <Grid.Column textAlign="right">
          <NavLink exact activeClassName="active" to="/profile" className={styles.menuBtn}>
            <Icon name="user circle" size="large" />
          </NavLink>
          <Button basic icon type="button" className={`${styles.menuBtn} ${styles.logoutBtn}`} onClick={logout}>
            <Icon name="log out" size="large" />
          </Button>
        </Grid.Column>
      </Grid>
    </div>
  );
};
Header.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  updatePersonalField: PropTypes.func.isRequired
};

export default Header;
