import React from 'react';
import PropTypes from 'prop-types';

import './likes-list.scss';

const LikesList = ({ users }) => (
  users.length ? (
    <div className="block-absolute">
      <ul>
        {
          users.map(el => <li key={el.id}>{el.user.username}</li>)
        }
      </ul>
    </div>
  ) : (
    null
  )
);

LikesList.defaultProps = {
  users: []
};

LikesList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};

export default LikesList;
