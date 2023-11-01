import nodemailer from 'nodemailer';

//async...await is not allowed in global scope, must use a wrapper
const sendEmail=async function(email,subject,message){

    //create test account
    let testAccount=await nodemailer.createTestAccount()
    //create reusable transporter using the default SMTP transport
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false, //true for 465, false for others
        
        auth:{
            user:process.env.SMTP_USERNAME,
            pass:process.env.SMTP_PASSWORD
        }
    });

    //send email with defined transport object
    await transporter.sendMail({
        from:process.env.SMTP_FROM_EMAIL,
        to:'mishraankit987@gmail.com',  //receiver mail
        subject:subject,//subject line
        html:message //html body
    })
}
export default sendEmail;