var express = require('express') //import express module
var router = express.Router()
const {
    registerUser,
    loginUser,
    logoutUser,
    currentUser,
    loginPage,
    registerPage,
} = require('../controllers/userController')
const { validateTokenHandler } = require('../middleware/validateTokenHandler')
const { asyncHandler } = require('../middleware/errorHandler')

router.route('/login').get(loginPage)
router.route('/register').get(registerPage)
router.get('/current', validateTokenHandler, currentUser)
router.get('/logout', validateTokenHandler, logoutUser)

router.post('/register', asyncHandler(registerUser))
router.post('/login', asyncHandler(loginUser))

module.exports = router