import { user, pass } from '../config/mailConfig';

const nodemailer = require('nodemailer');

const resetTemplate = (sendTo, payload) => ({
  from: 'Thread Inc thread.for.customers@gmail.com',
  to: sendTo,
  subject: 'Do you want to reset your password?',
  html: ` Follow next link if you might change your current password.
          <i>Referer link:</i>
          <a href=http://localhost:3000/profile/${payload}
          target='_blank' noopen noreferer> Change your password </a>`
});

const likeTemplate = (sendTo, payload) => ({
  from: 'Thread Inc thread.for.customers@gmail.com',
  to: sendTo,
  subject: 'Great news! Your post was liked!',
  html: `Your post, wich you've left in common Thread news feed was liked by user ${payload}.
        <h3>Look up for new posts</h3> on
        <a href=http://localhost:3000/
        target='_blank' noopen noreferer> <strong>Thread.com</strong></a>`
});
const shareTemplate = (sendTo, payload) => ({
  from: 'Thread Inc thread.for.customers@gmail.com',
  to: sendTo,
  subject: 'Someone\'s shared post with you!',
  html: `User ${payload.username} send
        <a href=${payload.postLink} target="_blank noopen noreferer"> Post </a> to you
        <h3>Look up for new posts</h3> on
        <a href=http://localhost:3000/
        target='_blank' noopen noreferer> <strong>Thread.com</strong></a>`
});

export const sendMail = async (sendTo, payload, type = 'password') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
  let body;
  switch (true) {
    case type === 'password':
      body = resetTemplate(sendTo, payload);
      break;
    case type === 'like':
      body = likeTemplate(sendTo, payload);
      break;
    case type === 'sharePost':
      body = shareTemplate(sendTo, payload);
      break;
    default:
      break;
  }
  //  const body = (type === 'password') ? resetTemplate(sendTo, payload) : likeTemplate(sendTo, payload);
  const result = await transporter.sendMail(body);
  return result;
};
