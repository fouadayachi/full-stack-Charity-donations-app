import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return res.status(401).json({success: false, message: "Unauthorized nit"});
    }
    try {
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
        if(!decoded){
            return res.status(401).json({success: false, message: "token is not valid"});
        }
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "server error", error: error.message});
        
    }
}

export default verifyToken;