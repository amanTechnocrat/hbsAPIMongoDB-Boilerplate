const Jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config()
const Jwtkey = 'test';
const path = require('path');


const { NODE_ENV, NODE_PORT_ENV } = process.env;
exports.NODE_PORT = NODE_ENV === "production" ? NODE_PORT_ENV : 2222;
exports.successCode = 200;
exports.errCode = 403;
exports.allFieldsReqMessage="All fields are required"
exports.errMessage = 'Something went wrong!';
exports.wrongPassMessage = "Wrong Password";
exports.accountNotExistsMessage="Account not exists on this Email";
exports.reqEmailNPasswordMessage="Please send Email and Password";
exports.successStatus="Success";
exports.errorStatus="error"
exports.notRegEmailMessage="Email is not Registered"
exports.reqPasswordMessage="Please Provide Password"
exports.alExEmailMessage="Email Already Exists"

//JWt Token Genertaing Function
exports.genToken = (data,time) => {
    let token = Jwt.sign({ data }, Jwtkey, { expiresIn: time||"2d" })
    return token
}
//JWt Token Verifying Function
exports.verifyToken = (req, res, next) => {
    let token = req.cookies["token"] || req.cookies["tokenX"]
    if (token) {
        Jwt.verify(token, Jwtkey, (err, valid) => {
            if (err) {
                res.redirect('/login');
            } else {
                res.valid=valid
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

//Multer Initialization
const fileinfo = multer.diskStorage({
    destination: (req, file, cb) => {
        const directory = `./images/${file.fieldname}`
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true })
        }
        cb(null, directory)
      },
    filename: (req, file, cb) => { cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.substring(file.mimetype.lastIndexOf('/') + 1)}`); }
})

//Multer Function Initialization 
exports.upload = multer({
    storage: fileinfo,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        filter(file, cb);
    }
})

//Function for the Image Filter
const filter = (file, cb) => {
    const allowedtypes = /jpg|jpeg|png/;
    const extname = allowedtypes.test(path.extname(file.originalname))
    if (extname) {
        return cb(null, true)
    } else {
        cb(new Error('Only images are allowed'))
    }
}

//Nodemailer Function
exports.mail = (to_user,token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM,
            pass: process.env.PASSWORD
        }
    })
    let mails = {
        from: process.env.FROM,
        to: to_user,
        subject: "Reset Password",
        html:`Visit this link for reset new password<br>
        Link: <a href='http://localhost:9999/setforgetpasspage/${token}'>click to reset your account</a><br />`
    }
    transporter.sendMail(mails, (err, info) => {
        if (err) throw err;
    })
}