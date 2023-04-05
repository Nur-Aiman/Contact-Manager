const User = require('../models/userModel')
const Contact = require('../models/contactModel')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET
const session = require('express-session')
const flash = require('connect-flash')

module.exports = {
  //@desc Register a user
  //@route POST /api/users/register
  //@access public
  registerUser: function registerUser(req, res) {
    const email = req.body.email

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      req.flash('registerError', 'Invalid email format')
      return res.redirect('/api/users/register')
    }

    User.findOne({ email: email })
      .then((existingUser) => {
        if (existingUser) {
          req.flash('registerError', 'Email already in use')
          res.redirect('/api/users/register')
        } else {
          const data = {
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, saltRounds),
            email: email,
            token: '',
          }

          const token = jwt.sign({ email: data.email }, jwtSecret)

          data.token = token

          User.insertMany([data])

          res.redirect('/api/users/login')
        }
      })
      .catch((err) => {
        console.log(err)
        req.flash('registerError', 'Registration error')
        res.redirect('/api/users/register')
      })
  },

  //@desc Login user
  //@route POST /api/users/login
  //@access public
  loginUser: function loginUser(req, res) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'User does not exist')
          res.redirect('/api/users/login')
        } else if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            name: user.name,
            password: user.password,
            email: user.email,
            // add any other properties as needed
          }
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
          })
          res.cookie('access_token', token, { httpOnly: true })
          res.redirect('/main')
        } else {
          req.flash('error', 'Wrong password')
          res.redirect('/api/users/login')
        }
      })
      .catch((err) => {
        console.log(err)
        req.flash('error', 'Wrong details')
        res.redirect('/api/users/login')
      })
  },

  //@desc Go to login page
  //@route GET /api/users/login
  //@access public
  loginPage: function loginPage(req, res) {
    const error = req.flash('error')
    return res.render('login', { error })
  },

  //@desc Go to register page
  //@route GET /api/users/register
  //@access public
  registerPage: function registerPage(req, res) {
    const error = req.flash('registerError')
    return res.render('register', { error })
  },

  //@desc Logout user and go to home page
  //@route GET /api/users/logout
  //@access private
  logoutUser: function logoutUser(req, res) {
    console.log('User logged out : ', req.user.email)
    res.clearCookie('access_token')
    res.redirect('/')
  },

  //@desc Go to profile page
  //@route GET /api/users/current
  //@access private
  currentUser: function currentUser(req, res) {
    const currentUser = req.user
    //console.log(currentUser)

    Contact.countDocuments(
      { contactOwner: currentUser.email },
      (err, count) => {
        if (err) {
          console.log(err)
          return res.status(500).send('Error while finding contacts')
        }

        res.render('currentUser', {
          name: currentUser.name,
          email: currentUser.email,
          totalContacts: count,
        })
      }
    )
  },
}
