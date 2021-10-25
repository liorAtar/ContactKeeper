const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {

        // Once vertify the payload is gonna be put in decoded
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Take the user out from decoded to the request 
        req.user = decoded.user;

        // Call next to move on
        next();
    } catch (err) {

        console.log(err.message);

        // If not valid
        res.status(401).json({ mgs: 'Token is not valid' });
    }
}