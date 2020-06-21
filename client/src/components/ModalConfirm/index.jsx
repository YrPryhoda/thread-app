import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ModalWindow = ({
  data,
  confirmDelete,
  close
}) => (
  <Modal
    dimmer="blurring"
    size="mini"
    centered
    open={data.open}
    onClose={close}
    closeIcon
    closeOnEscape
    closeOnDimmerClick={false}
  >
    <Modal.Content>
      <p>Are you sure you want to delete this?</p>
    </Modal.Content>
    <Modal.Actions>
      <Button
        negative
        icon="remove"
        labelPosition="left"
        content="No"
        onClick={close}
      />
      <Button
        positive
        icon="checkmark"
        labelPosition="right"
        content="Yes"
        onClick={() => confirmDelete(data.id, data.target)}
      />
    </Modal.Actions>
  </Modal>
);

ModalWindow.propTypes = {
  data: PropTypes.PropTypes.objectOf(PropTypes.any).isRequired,
  confirmDelete: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

export default ModalWindow;
