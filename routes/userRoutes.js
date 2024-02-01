const express = require('express');
const router = express.Router()
const usercont = require('../controller/usercont')
const config = require("../config")


//Routes of API
router.get("/", config.verifyToken, usercont.getuserdetails)
router.get("/getuserbyid/:id", config.verifyToken, usercont.getuserdetailsbyid)
router.post("/updateuser/:id", config.verifyToken, usercont.updateuserdetails)
router.get("/deleteuser/:id", config.verifyToken, usercont.deleteuserbyid)
router.get("/profileimg/:id", config.verifyToken, usercont.viewimage)




module.exports = router;
