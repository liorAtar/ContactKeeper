const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { check, validationResult} = require('express-validator/check')

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private
router.get('/', auth, async (req, res) => {
    try {
        // Get the contacts from the Database when the date is the last parameter
        const contacts = await Contact.find({ user: req.user.id}).sort({
            date: -1
        });
        res.json(contacts);
    } catch (err) {
        console.log(err.message);

        // Send Server Error
        res.status(500).json('Server Error');
    }
});

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post('/', (req, res) => {
    res.send('Add contact');
});

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put('/:id', (req, res) => {
    res.send('Update contact');
});

// @route     DELETE api/contacts/:id
// @desc      Delete  contact
// @access    Private
router.delete('/:id', (req, res) => {
    res.send('Delete  contact');
});

module.exports = router;
