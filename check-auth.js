const {SECRET_KEY} = require('./config')
const jwt = require('jsonwebtoken')

module.exports = (authorization, res) => {
    if(authorization){
        const token = authorization.split(' ')[1]
        if (token) {
            try {
              const user = jwt.verify(token, SECRET_KEY)
              return user
            } catch (err) {
                res.status(403).send('Invalid/Expired token');
                throw new AuthenticationError('Invalid/Expired token')
            }
          }
          res.status(403).send("Authentication token must be 'Bearer [token]'");
          throw new Error("Authentication token must be 'Bearer [token]'")
    }
    res.status(403).send('Authorization header must be provided');
    throw new Error('Authorization header must be provided')
}