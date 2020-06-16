import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Icon, Form } from 'semantic-ui-react';

import styles from './styles.module.scss';

const SharedPostLink = ({ postId, onSendShare, close }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendTo, setSendTo] = useState('');
  let input = useRef();
  const copyToClipboard = e => {
    input.select();
    document.execCommand('copy');
    e.target.focus();
    setCopied(true);
  };
  const onChange = e => setSendTo(e.target.value);
  const onSubmit = async (userEmail, postLink) => {
    if (userEmail) {
      setLoading(true);
      await onSendShare(userEmail, postLink);
      setLoading(false);
      close();
    }
  };
  return (
    <Modal open onClose={close}>
      <Modal.Header className={styles.header}>
        <span>Share Post</span>
        {copied && (
          <span>
            <Icon color="green" name="copy" />
            Copied
          </span>
        )}
      </Modal.Header>
      <Modal.Content>
        <Input
          fluid
          action={{
            color: 'teal',
            labelPosition: 'right',
            icon: 'copy',
            content: 'Copy',
            onClick: copyToClipboard
          }}
          value={`${window.location.origin}/share/${postId}`}
          ref={ref => { input = ref; }}
        />
        <br />
        <Form onSubmit={() => onSubmit(sendTo, input.props.value)}>
          <Form.Group>
            <Form.Input
              placeholder="email"
              name="email"
              value={sendTo}
              onChange={e => onChange(e)}
            />
            <Form.Button
              content="Send"
              icon="send"
              labelPosition="right"
              color="teal"
              loading={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

SharedPostLink.propTypes = {
  postId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  onSendShare: PropTypes.func.isRequired
};

export default SharedPostLink;
