const User = require('../models/userModel')
const Contact = require('../models/contactModel')
const session = require('express-session')
const path = require('path')

const ViewAllContactPage = '/api/contacts'
const MainPage = '/main'

module.exports = {
    //@desc Create a new contact
    //@route POST /api/contacts
    //@access private
    createContact: function createContact(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' })
        } else {
            const currentUser = req.user
            const name = req.body.name
            const email = req.body.email
            const phone = req.body.phone

            // validate name
            if (!name) {
                return res.status(400).json({ message: 'Name is required' })
            }

            // validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ message: 'Email is invalid or missing' })
            }

            // validate phone
            const phoneRegex = /^\d+$/
            if (!phone || !phoneRegex.test(phone)) {
                return res.status(400).json({ message: 'Phone is invalid or missing' })
            }

            const newContact = {
                user: currentUser._id, // current user info
                contactOwner: currentUser.email,
                name: name,
                email: email,
                phone: phone,
            }

            Contact.insertMany([newContact]).then(() => {
                //console.log("[USER: " + req.session.user.email + " ]" + "[PATH: " + req.route.path + " ]" + "[FILE: " + path.basename(__filename) + " ]")
                res.redirect(ViewAllContactPage)
                console.log('Contact added successfully', newContact)
            })
        }
    },

    //@desc Go to create contact page
    //@route GET /api/contacts/addContact
    //@access private
    createContactPage: function createContactPage(req, res) {
        return res.render('addContact')
    },

    //@desc Go to update contact page
    //@route GET /api/contacts/updateContact/:id
    //@access private
    updateContactPage: function updateContactPage(req, res) {
        const currentUser = req.user
        const contactId = req.params.id
        Contact.findOne({ _id: contactId, user: currentUser._id },
            function(err, contact) {
                if (err) {
                    return res.status(500).send('Error while finding contact')
                }
                if (!contact) {
                    return res.status(404).send('Contact not found')
                }

                const name = req.user.name

                return res.render('updateContact', { contact })
            }
        )
    },

    //@desc Delete contact
    //@route DELETE /api/contacts/:id
    //@access private
    deleteContact: function deleteContact(req, res) {
        const currentUser = req.user
        const contactId = req.params.id

        Contact.findOneAndDelete({ _id: contactId, user: currentUser._id },
            (err, contact) => {
                if (err) {
                    return res.status(500).send('Error while deleting contact')
                }

                if (!contact) {
                    return res.status(404).send('Contact not found')
                }

                res.redirect(ViewAllContactPage)
                    //res.send("Contact deleted")
                console.log('Contact deleted:', contact)
            }
        )
    },

    //@desc Update contact
    //@route PUT /api/contacts/:id
    //@access private
    updateContact: function updateContact(req, res) {
        const currentUser = req.user
        const contactId = req.params.id

        Contact.findOne({ _id: contactId, user: currentUser._id },
            (err, contact) => {
                if (err) {
                    return res.status(500).send('Error while updating contact')
                }

                if (!contact) {
                    return res.status(404).send('Contact not found')
                }

                const updatedContact = {
                    name: req.body.name || contact.name,
                    email: req.body.email || contact.email,
                    phone: req.body.phone || contact.phone,
                }

                if (!updatedContact.name) {
                    return res.status(400).json({ message: 'Name is required' })
                }

                // validate email
                const email = updatedContact.email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!email || !emailRegex.test(email)) {
                    return res
                        .status(400)
                        .json({ message: 'Email is invalid or missing' })
                }

                // validate phone
                const phone = updatedContact.phone
                const phoneRegex = /^\d+$/
                if (!phone || !phoneRegex.test(phone)) {
                    return res
                        .status(400)
                        .json({ message: 'Phone is invalid or missing' })
                }

                Contact.findOneAndUpdate({ _id: contactId, user: currentUser._id },
                    updatedContact, { new: true },
                    (err, updatedContact) => {
                        if (err) {
                            return res.status(500).send('Error while updating contact')
                        }

                        res.redirect(ViewAllContactPage)
                        console.log('Contact updated:', updatedContact)
                    }
                )
            }
        )
    },

    //@desc View contacts
    //@route GET /api/contacts/
    //@access private
    getContacts: function getContacts(req, res) {
        const currentUser = req.user
        Contact.find({ user: currentUser._id }, function(err, contacts) {
            const name = req.user.name

            return res.render('viewAllContact', { contacts })
        })
    },

    //@desc View single contact
    //@route GET /api/contacts/:id
    //@access private
    getContact: function getContact(req, res) {
        const currentUser = req.user
        const contactId = req.params.id

        Contact.findOne({ _id: contactId, user: currentUser._id },
            (err, contact) => {
                if (err) {
                    return res.status(500).send('Error while finding contact')
                }

                if (!contact) {
                    return res.status(404).send('Contact not found')
                }

                const name = req.user.name

                return res.render('viewSingleContact', { contact })
            }
        )
    },
}