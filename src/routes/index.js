const express= require('express')
const router = express.Router()

const UserRoutes = require('./User')
 router.use('/user',UserRoutes)

 module.exports = router