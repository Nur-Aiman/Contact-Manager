var express = require('express') //import express module
var router = express.Router()
const {
    createContact,
    getContacts,
    getContact,
    updateContact,
    deleteContact,
    createContactPage,
    updateContactPage,
} = require('../controllers/contactController')
const methodOverride = require('method-override')
const { validateTokenHandler } = require('../middleware/validateTokenHandler')
const { asyncHandler } = require('../middleware/errorHandler')

router.use(methodOverride('_method'))
router.use(validateTokenHandler)

router.route('/addContact').get(createContactPage)
router.route('/updateContact/:id').get(updateContactPage)

router
    .route('/')
    .get(asyncHandler(getContacts))
    .post(asyncHandler(createContact))
router
    .route('/:id')
    .get(asyncHandler(getContact))
    .put(asyncHandler(updateContact))
    .delete(asyncHandler(deleteContact))

module.exports = router