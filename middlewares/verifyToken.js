const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.header('Authorization');
    if (!bearerHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const bearer = bearerHeader.split(' ');

    const token = bearer[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const fixedSecretKey = 'your-secret-key';

    try {
        const decoded = jwt.verify(token, fixedSecretKey);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;