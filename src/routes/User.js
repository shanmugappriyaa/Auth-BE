const express = require('express')
const userController = require('../controller/User')
const router  = express.Router()

router.get('/',userController.getUsers)
router.post('/create',userController.createUser)
router.post('/login',userController.login)
router.post('/forgotPassword',userController.forgotPassword)
router.put('/resetPassword',userController.resetPassword)
router.post('/otp',userController.verifyOTP)

module.exports = router