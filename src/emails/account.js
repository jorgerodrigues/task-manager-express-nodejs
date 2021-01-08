const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.send({
  to: "jorgelopes@hey.com",
  from: "jlrmoc@gmail.com",
  subject: "This is our first email",
  text: "This is the body of the first email. Trying it out.",
});

// not yet done because of security error when on the confirming emails from sendgrid
