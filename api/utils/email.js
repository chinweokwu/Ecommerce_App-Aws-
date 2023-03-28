import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

export const sendEmail = asyncHandler(async(data, req, res)=> {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
      user: process.env.HOST,
      pass: process.env.PASS
    },
  });

   let info = await transporter.sendMail({
    from: process.env.HOST,
    to: data.email,
    subject: data.subject,
    html: data.message
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}) 
