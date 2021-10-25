const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const auth = require('../middleware/auth')
const { check, validationResult} = require('express-validator/check')

const User = require('../models/User');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', auth, async (req, res) => {
    try {
         // Get the user from the Database without the pssword
        const user = await User.findById(req.user.id).select('-password');

        res.json(user);
    } catch (err) {
        console.log(err.message);

        // Sends Server Error
        res.status(500).send('Server Error');
    }
});

// @route     POST api/auth
// @desc      Auth user & get token
// @access    Pubic
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    ],  
    async (req, res) => {
        // Announs the error that occurred
        const errors = validationResult(req);

        // Check if there is an error
        if(!errors.isEmpty()){
            // Returns the error info
            return res.status(400).json({ errors: errors.array()});
        }

        const { email, password} = req.body;

        try {
            let user = await User.findOne({ email });

            if(!user){
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

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
            res.status(500).send('Server error')
        }
});

module.exports = router;
 