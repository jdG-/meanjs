'use strict';

/**
 * Module dependencies.
 */
var nodemailer = require('nodemailer'),
    config = require('../../config/config');

/**
 * Send an Email
 */
exports.send = function(req, res) {

    var smtpTransport = nodemailer.createTransport(config.mailer.options);
    var mailOptions = {
        to: config.mailer.recipient.email,
        from: req.body.email,
        subject: 'Contact',
        html: '<p>Message from : ' + config.app.title + '</p><br/><h3>Message</h3><p>' + req.body.message + '</p>'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
            res.send({
                message: 'An email has been sent to us.'
            });
        } else {
            res.status(400).send(err);
        }
    });
};
