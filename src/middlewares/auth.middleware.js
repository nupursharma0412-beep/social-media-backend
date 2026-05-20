const jwt = require('jsonwebtoken')
async function identifyUser(req,res,next){
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "token not provided "
        })
    }
    let decoded=null;

    try {
           decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).json({
            message:"user not authorized"
        })
    }

    req.user = decoded;
    next()

}

module.exports = identifyUser;