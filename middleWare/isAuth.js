


const jwt = require('jsonwebtoken');

module.exports = (req , res , next) => {
    // Extracting the token from the Authorization header
    const authHeader = req.get('Authorization');
    
    // Check if the header exists and contains a valid token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - Missing or invalid token' });
    }
    
    // Extracting the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, 'AkhilGreat', (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        } else {
            // If token is valid, set the decoded user ID in the request
            req.userId = decodedToken.id;
            next();
        }
    });
};
