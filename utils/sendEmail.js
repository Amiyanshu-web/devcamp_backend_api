const nodemailer = require("nodemailer");
const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'}); 

// async..await is not allowed in global scope, must use a wrapper
const sendEmail=async (options)=> {
   

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
     auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  let message ={
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
    to: options.email,
    subject: options.subject,
    text:options.message
  };

  const info=await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  
}

module.exports=sendEmail;