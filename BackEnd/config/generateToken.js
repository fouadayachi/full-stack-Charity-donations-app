import jwt from 'jsonwebtoken';

const generateToken = (id,res) => {
    const token = jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: '7d'
    });
    res.cookie("token",token,{
        httpOnly: true,
        maxAge: 7*24*60*60*1000,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production' ? true : false
    });
    return token;
};
export default generateToken;