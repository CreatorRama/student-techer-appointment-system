const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use another service like 'SendGrid', 'Mailgun', etc.
  auth: {
    user: 'ap410485@gmail.com', // Replace with your email
    pass: 'pbaa msog ugul odpz'
  }
});

const sendApprovalEmail = async (studentEmail, appointmentDetails,status) => {
    let message;
    if(status==='approved'){
        message=`${'Your Appointment is Approved.'}\nKindly be present on time
        in School Premises on Given Date below.`

    }
    else{
        message='Your Appointment is Rejected'
    }
  try {
    const mailOptions = {
      from: 'ap410485@gmail.com', // Replace with your email
      to: studentEmail,
      subject: message,
      text: `${message}!\n\nDetails:\n${appointmentDetails}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendApprovalEmail;
