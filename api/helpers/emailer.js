const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transportmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dilshanmadhushanka42@gmail.com', // Replace with your email
        pass: 'uffv rdpp rwnv sfch' // Replace with your email password (make sure to use environment variables for security)
    }
});

async function sendEmail(toEmail, title, body) {
    // Email options
    let mailOptions = {
        from: 'dilshanmadhushanka42@gmail.com', // Sender address
        to: toEmail, // List of recipients
        subject: title, // Subject line
        html: body // HTML body
    };

    try {
        // Send email
        // let info = await transporter.sendMail(mailOptions);

        transportmail.sendMail(mailOptions,function(err,val){
          if(err){
              console.log(err)
          }else{
              console.log(val.response,"sent Mail...")
          }
      })

        // console.log(`Message Sent: ${info.response}`);
        // return info.response;
    } catch (error) {
        console.error(`Error: ${error}`);
        if (error.response) {
            console.error(error.response.body);
            return error.response.body;
        }
        return error;
    }
}

module.exports = sendEmail;

