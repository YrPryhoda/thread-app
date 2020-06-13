const nodemailer = require('nodemailer');

export const sendMail = async (sendTo, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thread.for.customers@gmail.com',
      pass: 'ThreadSupport2020'
    }
  });
  const result = await transporter.sendMail({
    from: 'Thread Inc thread.for.customers@gmail.com',
    to: sendTo,
    subject: 'Do you want to reset your password?',
    text: 'Follow next link if you might change your current password',
    html: `<i>Referer link:</i>
          <a href=http://localhost:3000/profile/${link}
          target='_blank' noopen noreferer> Change your password </a>`
  });
  return result;
};
