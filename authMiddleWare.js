
require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    //     --- Dont forget to add JWT_SECRET in .env ---
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        next();
    });
}
module.exports.authenticateToken = authenticateToken;


function refreshToken(req, res, next) {
    let token = req.header('Authorization');
    if (!token) {
        next();

        // Do nothing
    } else {

        //     --- Dont forget to add JWT_SECRET in .env ---
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            token = jwt.sign({ username: user }, process.env.JWT_SECRET, { expiresIn: '2m' });
            res.cookie("token", token);
            res.setHeader('Authorization', token);
            console.log(token);
            // req.user = user;
            next();
        });
    }
};

module.exports.refreshToken = refreshToken;




function eraseTokenFromCookie(res) {
    res.clearCookie('token');
};

module.exports.eraseTokenFromCookie = eraseTokenFromCookie;