const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const { check, validationResult} = require('express-validator/check')

const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
    '/', 
    [
        // Check if name was added
        check('name', 'Please add name')
        .not()
        .isEmpty(),

        // Check if email was added and valid
        check('email', 'Please include a valid email').isEmail(),

        // Check if password was added and has min 6 characters
        check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
    ],
    async  (req, res) => {

        // Announs the error that occurred
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()});
        }

        const {name, email, password} = req.body;

        try{

            // Search for user with this email
            let user = await User.findOne({ email });

            // Check if user with this email already exists
            if(user){

                // Return error message
                return (res.status(400).json({ msg: 'User already exists'}))
            }

            // Create new user
            user = new User({
                name,
                email,
                password
            });

            // Generate a salt (returns a promise) (10 - how secure the salt is)
            const salt = await bcrypt.genSalt(10);

            // Hash the password with the salt
            user.password = await bcrypt.hash(password, salt);

            // Save in the Database
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign
            (
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000
                }, 
                (err, token) => {
                    if(err) throw err;
                    res.json({ token }); 
                }
            );

        } catch (err) {
            console.log(err.message);

            // Server error
            res.status(500).json('Server error')
        }
});

module.exports = router;
