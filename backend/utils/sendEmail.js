const nodemailer=require("nodemailer");

const sendEmail=async (options)=>{
   //this sendEmail functionality is only for testing purpose
   const transporter=nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f0d2a5dde35f72",
        pass: "58241d93e88bb8"
      }
   })
   const mailOptions=({
    from:"",
    to:options.email,
    subject:options.subject,
    text:options.message
   });
  await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;