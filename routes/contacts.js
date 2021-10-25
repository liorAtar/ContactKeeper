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
        res.status(500).send('Server Error');
    }
});

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post(
    '/',
    [
        auth, 
            [
                check('name', 'Name is required')
                .not()
                .isEmpty()
            ]
    ],
    async (req, res) => {

        // Announs the error that occurred
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()});
        }

        const {name, email, phone, type} = req.body;

        try {

            // Creates new contact
            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            });

            // Save the contact to the Database 
            const contact = await newContact.save();

            // Return the contact to the client
            res.json(contact);
        } catch (err) {
            console.log(err.message);

            // Sends Server Error
            res.status(500).send('Server Error');
        }
    }
);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put('/:id', auth, async (req, res) => {
    const {name, email, phone, type} = req.body;

    // Build contact object
    const contactFields = {}
    
    // Check if there is a name/email/phone/type
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        let contact =  await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sue user owns contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized'});
        }

        // Find and update the contact to the Database             
        contact = await Contact.findByIdAndUpdate(req.params.id, 
            { $set: contactFields},
            { new: true });

        // Return the contact to the client
        res.json(contact);
            
    } catch (err) {
        console.log(err.message);

            // Sends Server Error
            res.status(500).send('Server Error');
    }
});

// @route     DELETE api/contacts/:id
// @desc      Delete  contact
// @access    Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact =  await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sue user owns contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized'});
        }

        // Find and delete the contact from the Database             
        await Contact.findByIdAndRemove(req.params.id);
            
        res.json({ msg: 'Contact removed'});
    } catch (err) {
        console.log(err.message);

        // Sends Server Error
        res.status(500).send('Server Error');
    }
});

module.exports = router;
