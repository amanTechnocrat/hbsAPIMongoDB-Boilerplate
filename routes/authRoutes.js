const express = require('express');
const router = express.Router()
const authcont = require('../controller/authcont')
const config = require("../config")



//Routes for Page Rendering 
router.get("/login", authcont.loginpage)
router.get("/forgetpasspage",authcont.forgetpasspage)
router.get("/changepasswordpage", authcont.changepasswordpage)
router.get("/setforgetpasspage/:id",authcont.setforgetpasswordpage)
router.get("/signup", authcont.signuppage)

//APIRoutes
router.post("/adduser", authcont.adduserdetails)
router.post("/changepasswordapi", authcont.changepasswordapi)
router.get('/logout', authcont.logout)
router.post("/loginapi", authcont.loginapi)
router.post('/forgetpassword', authcont.sendmail)
router.post("/setforgetpassword", config.verifyToken,authcont.setforgetpassword)

module.exports = router;
