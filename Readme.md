# Programming Test Bukit Vista - Node JS Back End - Dede

A simple private API server that will return image url of movie poster using third party service OMDB. I have deployed this API on heroku : http://omdb-poster.herokuapp.com

## Endpoint

1. http://omdb-poster.herokuapp.com/register **(POST)**
        
        - Create an account by input name an password
2. http://omdb-poster.herokuapp.com/login **(POST)**
        
        - Login to get an token for auth
        - Name and password required
        - Token is use to access other endpoint as authorization
3. http://omdb-poster.herokuapp.com/movies/ {movie title} **(GET)**
        
        - Return poster url of that movie
        - Authorization required
4. http://omdb-poster.herokuapp.com/movies/favorite **(GET)**
        
        - Return all poster url of that user's favorite movies
        - Authorization required
5. http://omdb-poster.herokuapp.com/movies/favorite **(POST)**
       
       - Insert into user's favorite movie database
        - Authorization required
6. http://omdb-poster.herokuapp.com/user **(GET)**
        
        - Get all user data (just additional)
