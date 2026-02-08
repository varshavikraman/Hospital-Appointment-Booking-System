import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const rawCookies = req.headers.cookie;
    
    if (!rawCookies) {
        return res.status(404).json({ msg: 'Cookie not found' });
    }

    // Find the authToken specifically among other cookies
    const token = rawCookies
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

    if (token) {
        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decode;
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Invalid or expired token' });
        }
    } else {
        res.status(401).json({ msg: 'Unauthorized access: No authToken found' });
    }
}

export {authenticate}