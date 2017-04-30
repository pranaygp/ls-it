const Rx = require('rx')
const _ = require('lodash')
const nodemailer = require('nodemailer');

const reducer = require('./reducer')
const Sources = require('./sources')

const config = require('../config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

function sendMail(subject, text) {
  const mailOptions = {
      from: '"Event Notifier" <noreply@gmail.com>',
      to: config.email.user,
      subject,
      text
    };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      return console.log(error);
    }
    console.log('Email Message sent!');
  });
}

Rx.Observable
  .merge(_.map(Sources, _.identity))
  .startWith([])
  .scan(reducer)
  .distinctUntilChanged()
  .subscribe(list => {
    sendMail("TODO list", list.join('\n'))
  })