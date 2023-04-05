const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    validateTokenHandler: function validateTokenHandler(req, res, next) {
        const token = req.cookies.access_token

        if (!token) {
            res.locals.message = 'Please log in'
            setTimeout(() => {
                res.redirect('/api/users/login')
            }, 1000)
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.locals.message = 'Please log in'
                    setTimeout(() => {
                        res.redirect('/api/users/login')
                    }, 1000)
                } else {
                    req.user = user
                    next()
                }
            })
        }
    },
}