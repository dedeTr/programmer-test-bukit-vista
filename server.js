const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pino = require('express-pino-logger')

const {SECRET_KEY} = require('./config')
const checkAuth = require('./check-auth')
const User = require('./models/User')
const Favorite_movies = require('./models/Favorite_movie')

const app = express()
app.use(bodyParser.json())
app.use(pino())

const PORT = process.env.PORT || 8000

//Table Relation
User.hasMany(Favorite_movies, {
    foreignKey: 'user_id'
})
Favorite_movies.belongsTo(User, {
    foreignKey: 'user_id'
})

//Generate Token for auth using JSON Web Token (JWT)
const generateToken = (user) => {
    return jwt.sign({
        id: user.user_id,
        name: user.name,
    },
        SECRET_KEY,
    {
        expiresIn: '1h'
    })
}

//---------------Router-----------------//

//GET all poster url of user's favorite movies
app.get('/movies/favorite', async (req, res) => {
    req.log.info()
    //get all user's favorite movies
    const user = checkAuth(req.header('Authorization'), res)
    const userFavMovie = await User.findByPk(user.id,{
        include: [Favorite_movies]
    }).then((u) => u)
    //  res.json(userFavMovie);
     const listFavMovies = JSON.parse(JSON.stringify(userFavMovie)).favorite_movies
     let listPoster = []
     let promises = []

     listFavMovies.map(listFavMovie => {
        promises.push(axios.get(`http://www.omdbapi.com/?t=${listFavMovie.title}&apikey=9cac5e3a`)
        .then((response) => listPoster.push({
            title: listFavMovie.title,
            poster: response.data.Poster?response.data.Poster:""
        }))) 
        
     })
     Promise.all(promises).then(() => res.status(200).send(listPoster))
});

app.get('/movies', (req, res) => {
    req.log.info()
    const user = checkAuth(req.header('Authorization'), res)
    res.status(403).send()
});

//GET poster url of that movie
app.get('/movies/:movie_title', (req, res) => {
    req.log.info()
    const user = checkAuth(req.header('Authorization'), res)
    const { movie_title } = req.params
    if(!movie_title.trim() == ''){
        axios.get(`http://www.omdbapi.com/?t=${movie_title}&apikey=9cac5e3a`)
            .then((response) => {
                if(response.data.Poster){
                    res.status(200).send(response.data.Poster)
                }else{
                    res.status(403).send('Not found')
                }
            }).catch((err) => res.status(403).send())
    }else{
        res.status(403).send()
    }

});

//Login
app.post('/login', async (req, res) => {
    req.log.info()
    const reqName = req.body.name
    const reqPassword = req.body.password

    const userLogin = await User.findAll({where:{name: reqName}}).then((user) => {
        return user
    })
    const match = await bcrypt.compare(reqPassword, userLogin[0].dataValues.password);
    if (!match) {
        res.status(401).send('Wrong crendetials');
        throw new Error('Wrong crendetials')
    }
    
    if(userLogin[0].dataValues){
        const token = generateToken(userLogin[0].dataValues)
        const {user_id, name, password} = userLogin[0].dataValues
        res.status(200).send({
            user_id,
            name,
            password,
            token
        });
    }else{
        res.status(401).send();
    }
});

//Register
app.post('/register', async (req, res) => {
    req.log.info()
    let { name, password } = req.body
    password = await bcrypt.hash(password, 12)
    User.create({
        name,
        password
    }).then((newUser) => {
        const token = generateToken(newUser.dataValues)
        res.status(201).json({
            ...newUser.dataValues,
            token
        });
   },(validation) => {
       res.status(422).json({
           errors: validation.errors.map((error) => {
               return {
                   attribute: error.path,
                   message: error.message
               }
           })
       })
   })

});

//POST user's favorite movie to database
app.post('/movies/favorite', (req, res) => {
    req.log.info()
    const user = checkAuth(req.header('Authorization'))
    const { title } = req.body
    Favorite_movies.create({
        title,
        user_id: user.id
    }).then((favorite) => {
         res.status(201).json(favorite);
    },(validation) => {
        res.status(422).json({
            errors: validation.errors.map((error) => {
                return {
                    attribute: error.path,
                    message: error.message
                }
            })
        })
    })
});

//GET all user from database
app.get('/user/', (req, res) => {
    req.log.info()
    User.findAll().then((users) => {
         res.json(users);
    })
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});