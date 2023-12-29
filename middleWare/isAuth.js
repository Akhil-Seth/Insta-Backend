const jwt = require('jsonwebtoken');

module.exports = (req , res , next) => {
    // console.log(req.get('Authorization'));
    const authHeader = req.get('Authorization').split(' ')[1];
    // console.log(authHeader);
    req.userId = authHeader;
    next();
}