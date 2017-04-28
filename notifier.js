const { PopcornTimeEvents$ } = require('./')
const nodemailer = require('nodemailer');
const _ = require('lodash')

const config = require('./config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});


PopcornTimeEvents$
  .map(episodes => episodes.sort((e1, e2) => e1.first_aired - e2.first_aired))
  // .subscribe(console.log)
  .subscribe(episodes => {
    const titles = _.uniq(episodes.map(e => e.title))
    const lines = episodes.map(episode => `${episode.title} Season ${episode.season} Episode ${episode.episode}`).join('\n')

    const mailOptions = {
      from: '"Event Notifier" <noreply@gmail.com>',
      to: config.email.user,
      subject: `New "${titles.join(', ')}" epsiodes!`,
      text: `${lines}\n\nIs/Are out on Popcorn Time!`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email Message sent!');
    });
  })