const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const contactUs = require('../models/contact-us.model.ts');

exports.contactUsTest = (req: any, res: any ) => {
    console.log('Contact API Works!')
    return res.status(200).json({msg: "contact us worked"})
}

exports.sendMessage = (req: any, res: any) => {

    console.clear();
    console.log('Sending Message');
    console.log(req.body);
  
    let fullName = req.body.fullName;
    let email = req.body.email;
    let message = req.body.message;
  
    if(!fullName || !email || !message) {
      console.log('There was either no Full Name or Email in the Request!');
      return res.status(400).json({msg: "There was either no Fullname, Email, or Message in the Request!"})
    }

    // Create HTML Template w/ Handlebars
    // point to the template folder
    const handlebarOptions = {
      viewEngine: {

          partialsDir: path.resolve('./controller/emails/'),
          defaultLayout: false,
      },
      viewPath: 
      path.resolve('./controller/emails/'),
    };



  
    // Set transport service which will send the emails
    var transporter =  nodemailer.createTransport({
      service: 'hotmail',
      auth: {
            user: 'eddie@finalbossar.com',
            pass: 'Et061792!',
        },
        debug: true, // show debug output
        logger: true // log information in console
    });


    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
  
  //  configuration for email details
   const FBSMailOptions = {
    from: 'eddie@finalbossar.com', 
    to: `eddie@finalbossar.com`, 
    subject: 'Message from CONTACT-US | Finalbossar.com',
    html:
    `
      <h1>Final Boss Studios</h1>
      <p>${fullName}</p>
      <p>${email}</p>
      <p>${message}</p>
      `
    };

  // Thank the User for contacting Final Boss Studios!
   var userMailOptions = {
    from: 'contact@finalbossar.com', 
    to: `${email}`, 
    subject: '√ Message from Final Boss Studios (finalbossar.com)',
    template: 'email',
    context: {
      fullName
    }
  }
  
  //  Email sent to Final Boss
   transporter.sendMail(FBSMailOptions, function (err: any, info: any) {
    if(err) {
      console.log(err)
      return res.status(400).json(err);
    }
    else {
      console.log(info);
      console.log('Email sent to Final Boss Admin');
      

      //  Email sent to user
      transporter.sendMail(userMailOptions, function (err: any, info: any) {
        if(err) {
          console.log(err)
          return res.status(400).json(err);
        }
        else {
          console.log(info);
          console.log('Email sent to User');
          
          return res.status(200).json({
            responseMsg: "Contact Message was sent"
            })
        }
      });
    }
   });

  
  
  }