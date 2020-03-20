"use strict";
const nodemailer = require("nodemailer");



  // create reusable transporter object using the default SMTP transport


  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

    // send mail with defined transport object
    //   let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>" // html body
    //   });

  const sendWelcomeEmail = async(email, name) => {
    //console.log(email, name)
    try{
      await transporter.sendMail({
        from: "simi@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Welcome, we're glad to have you on board", // Subject line
        text: `Hello world to ${name}`, // plain text body
        html: "<b>Hello world?</b>" // html body
      })
      console.log('Done')
    } catch {
      console.log('error')
    }
  }

  const sendCancelEmail = async (email, name) => {
    try {
      await transporter.sendMail({
        from: 'Similoluwa Odeyemi simi@simi.com',
        to: email,
        subject: "Sorry to see you go!",
        text: `Goodbye ${name}, I hope to see you back sometimes soon`
      })
    } catch (error) {
      
    }
  }

  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

//main().catch(console.error);

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}