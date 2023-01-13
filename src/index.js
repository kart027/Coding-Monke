const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const app = express();
const path = require('path');
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended : true}))

require('dotenv').config();




const a= []
const cron = require("node-cron");

const port = process.env.PORT || 5000;
const viewPath =  path.resolve(__dirname, './templates/views/');


app.use(express.static(path.join(__dirname, './public')))
app.use(express.json())
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./templates/views/"))




app.get("/",(req,res)=>{

 
  res.render('Home');


})


app.post("/sendmail",(req,res)=>{


  const{timevalue} = req.body;

  const k = timevalue.split(":");

  
 

  cron.schedule(`${k[1]} ${k[0]} * * *`, () => {
   sendMail();
  });

  res.render("Reply", {  hours : k[0], minutes:k[1] })

  
 
  


})

const sendMail = () => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: 'gamotkn@rknec.edu',
      
       pass: process.env.PASS
    }
  });
  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.handlebars',
   
      layoutsDir: viewPath,
      defaultLayout: false,
    
      express
    },
    viewPath: viewPath,
    extName: '.handlebars',
  }))

  var mailOptions = {
    from: 'gamotkn@rknec.edu',
    to: 'ayushbthakare@gmail.com,gamotkn@rknec.edu',
    subject: 'Sending Email using Node.js',
    template: 'index',
    context: {
      name: 'User'
  }
   
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

app.listen(port , () => {
    console.log(`server up to ${port}`)
   
}) 