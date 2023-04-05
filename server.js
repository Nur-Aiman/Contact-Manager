const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const collection = require('./models/userModel')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const { validateTokenHandler } = require('./middleware/validateTokenHandler')
const dotenv = require('dotenv').config()

const session = require('express-session')
const flash = require('connect-flash')

const Contact = require('./models/contactModel')
const templatePath = path.join(__dirname, './templates')

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(
  express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css')
      }
    },
  })
)

app.use(
  session({
    secret: 'wefrefrefegtrgtrbrrgergegt',
    resave: false,
    saveUninitialized: false,
  })
)

app.use(flash())

app.use(express.json())
app.set('view engine', 'hbs')
app.use('/images', express.static('images'))
app.set('views', templatePath)
app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(flash())

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/contacts', require('./routes/contactRoutes'))

app.get('/', (req, res) => {
  return res.render('home')
})

app.get('/main', validateTokenHandler, (req, res) => {
  const name = req.user.name
  return res.render('main', { name: name })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
