const mongoose = require('mongoose');
const userdetails = mongoose.model('user_details')
const config = require('../../config');
const genhash = require('../../helper/bcrypt').genhash;
const verifyhash = require('../../helper/bcrypt').verify;


//Login API
exports.loginapi = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            let user = await userdetails.findOne({ "email": req.body.email })
            if (user) {
                //Comaparing the user password to Hashcode
                user.comparePassword(req.body.password, async (err, isMatch) => {
                    if (err) return console.log(err);
                    if (isMatch === true) {
                        let token = config.genToken(user.email)
                        res.cookie("token", token)
                        res.cookie("userid", user._id)
                        res.cookie("userImage", user.userImage)
                        res.redirect('/');
                    } else {
                        res.render('message', { message: config.wrongPassMessage, path: "/", check: true })
                        return;
                    }
                });
            } else {
                res.render('message', { message: config.accountNotExistsMessage, path: "/", check: true })
                return;
            }
        } else {
            res.render('message', { message: config.reqEmailNPasswordMessage, path: "/", check: true })
            return;
        }
    } catch (err) {
        res.render('message', { message: err.message, path: "/", check: true })
        return;
    }
}

//User Register API
exports.adduserdetails = async (req, res) => {
    try {
        //Function for Image Upload
        config.upload.single("profileimg")(req, res, (err) => {
            if (err) {
                res.render('message', { message: err.message, path: "/signup", check: true })
                return
            } else {
                var receivedValues = req.body;
                if (
                    JSON.stringify(receivedValues) === '{}' ||
                    receivedValues === undefined ||
                    receivedValues === null ||
                    receivedValues === '') {
                    res.render('message', { message: "All fields are required", path: "/signup", check: true })
                    return;
                } else {
                    let fileds = {
                        firstName: receivedValues.firstName,
                        lastName: receivedValues.lastName,
                        email: receivedValues.email,
                        password: receivedValues.password,
                        mobileNo: receivedValues.mobileNo,
                        userImage: req.file.filename
                    }
                    let data = new userdetails(fileds)
                    //Saving New User to MongoDB
                    data.save((err, data) => {
                        if (!err) {
                            res.redirect('/');
                            return;
                        } else {
                            if (err.message.includes("E11000 duplicate key error collection")) {
                                res.render('message', { message: "Email Already Exists", path: "/signup", check: true })
                                return;
                            } else {
                                res.render('message', { message: err.message, path: "/signup", check: true })
                                return;
                            }
                        }
                    });
                }
            }
        })

    } catch (err) {
        res.render('message', { message: err.message, path: "/signup", check: true })
        return;
    }
}

//Sending Mail for Forgetpassword
exports.sendmail = async (req, res) => {
    try {
        if (req.body.email) {
            let check = await userdetails.find({ "email": req.body.email })
            if (check.length !== 0) {
                let token = config.genToken(req.body.email, "10m")
                config.mail(req.body.email, token)
                res.render('message', { message: "Mail is sended to your account follow that link to change your Password", path: "/login", check: true })
                return;
            } else {
                return res.render('message', { message: "Email is not found", path: "/forgetpasspage", check: true })
            }
        } else {
            return res.render('message', { message: config.errMessage, path: "/forgetpasspage", check: true })
        }
    } catch (err) {
        res.render('message', { message: err.message, path: "/forgetpasspage", check: true })
        return;
    }
}

//API for Setting Forget Password
exports.setforgetpassword = async (req, res) => {
    try {
        if (req.body.password) {
            let hashcode = await genhash(10, req.body.password) //function for Generating the hashtoken
            await userdetails.updateOne({ email: res.valid.data }, { password: hashcode });
            res.clearCookie("tokenX");
            return res.render('message', { message: "Password is Changed Now Login Again with New Password", path: "/login", check: true })
        } else {
            return res.render('message', { message: config.errMessage, path: "/login", check: true })
        }
    } catch (err) {
        res.render('message', { message: err.message, path: "/forgetpasspage", check: true })
        return;
    }
}

//API for Rendering Signup Page
exports.signuppage = (req, res) => {
    res.render('signup', { check: true })
}

//API for Rendering Login Page
exports.loginpage = (req, res) => {
    res.render('login', { check: true })
}

//API for Rendering Login Page
exports.changepasswordpage = (req, res) => {
    res.render('changepassword', { check: true })
}

//API for Rendering Forgetpassword Page 
exports.forgetpasspage = (req, res) => {
    res.render('sendemail', { check: true })
}

//API for Rendering setForgetpassword Page 
exports.setforgetpasswordpage = (req, res) => {
    res.cookie("tokenX", req.params.id)
    res.render('setforgetpassword', { check: true })
}

//Logout API
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect('/login');
}

//Change Password API
exports.changepasswordapi = async (req, res) => {
    try {
        var receivedValues = req.body;
        if (
            JSON.stringify(receivedValues) === '{}' ||
            receivedValues === undefined ||
            receivedValues === null ||
            receivedValues === '' || receivedValues.oldpassword === undefined || receivedValues.newpassword === undefined) {
            res.render('message', { message: config.reqPasswordMessage, path: "/changepasswordpage", check: true })
            return;
        } else {
              userdetails.findOne({ "_id": req.cookies["userid"] },async (err, result) => {
                if (err) throw err;
                else {
                    const checkpassword = await verifyhash(req.body.oldpassword, result.password)
                    if (checkpassword) {
                        let hashcode = await genhash(10, req.body.newpassword)
                        userdetails.findOneAndUpdate({"_id": req.cookies["userid"] }, {password:hashcode}, { returnDocument: 'after' }, (err)=> {
                            if (err) throw err;
                            else {
                                res.render('message', { message: "Password is Changed", path: "/", check: true })
                                return;
                            }
                        })
                    } else {
                        res.render('message', { message: "Old Password didn't Match ! You can't Change Password with this", path: "/changepasswordpage", check: true })
                        return
                    }
                }
            })
        }
    } catch (err) {
        res.render('message', { message: err.message, path: "/changepasswordpage", check: true })
        return
    }
}
