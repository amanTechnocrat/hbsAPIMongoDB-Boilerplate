const mongoose = require('mongoose');
const userdetails = mongoose.model('user_details')
const config = require('../../config');
const fs = require('fs');
const gentoken = require('../../helper/bcrypt').genhash;




//User Updating API
exports.updateuserdetails = async (req, res) => {
    try {
        //Updating Profile Image Function
        config.upload.single("profileimg")(req, res, (err) => {
            if (err) {
                res.render('message', { message: err.message, path: "/", check: true })
                return;
            } else {
                var receivedValues = req.body;
                req.file ? receivedValues.userImage = req.file.filename : null
                if (receivedValues === null || receivedValues == undefined) {
                    res.render('message', { message: "Fields is empty", path: "/", check: true })
                    return;
                }
                else {
                    userdetails.findOneAndUpdate({ "_id": req.params.id }, receivedValues, { returnDocument: 'after' }, (err, data) => {
                        if (!err) {
                            res.cookie("userImage", data.userImage)
                            res.redirect('/');
                            return;
                        } else {
                            res.render('message', { message: err.message, path: "/", check: true })
                            return;
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

//User Getting API
exports.getuserdetails = async (req, res) => {
    try {
        let pageSize = req.query.pageSize || 10
        let nextpage = req.query.next || 1
        let data = await userdetails.find().lean().limit(pageSize).skip(pageSize * (nextpage - 1))
        res.render('usersdata', { user: data, userdata: { userImage: req.cookies["userImage"] } })
        return;
    } catch (err) {
        res.render('message', { message: err.message, path: "/", check: true })
        return;
    }
}

//Getting User By ID API
exports.getuserdetailsbyid = async (req, res) => {
    try {
        let data = await userdetails.findOne({ "_id": req.params.id }).lean()
        res.render('edit', { userdata: data })
        return;
    } catch (err) {
        res.render('message', { message: err.message, path: "/", check: true })
        return;
    }
}

//User Deleting API
exports.deleteuserbyid = async (req, res) => {
    try {
        await userdetails.deleteOne({ "_id": req.params.id });
        res.redirect('/');
        return;
    } catch (err) {
        res.render('message', { message: err.message, path: "/", check: true })
        return;
    }
}

//Getting Profile Image API
exports.viewimage = (req, res) => {
    try {
        const path = `./images/profileimg/${req.params.id}`
        //Creating the Reading Stream for Image  
        const file = fs.createReadStream(path)
        res.setHeader('Content-Disposition', 'attachment: filename="' + req.params.url)
        file.pipe(res)
    } catch (err) {
        res.render('message', { message: err.message, path: "/", check: true })
    }
}







