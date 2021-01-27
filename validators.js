module.exports.validateLoginInput = (name, password, res) => {
    if(name && password){
        if (name.trim() === '') {
            res.status(401).send('Name must not be empty');
            throw new Error('Name must not be empty')
        }
        if (password.trim() === '') {
            res.status(401).send('Password must not be empty');
            throw new Error('Password must not be empty')
        }
    }else{
        res.status(401).send('Body request must not be empty');
        throw new Error('Body request must not be empty')
    }
  };
  
  module.exports.validateRegisterInput = (name, password, res) => {
    if(name && password){
        if (name.trim() === '') {
            res.status(401).send('Name must not be empty');
            throw new Error('Name must not be empty')
        }
        if (password.trim() === '') {
            res.status(401).send('Password must not be empty');
            throw new Error('Password must not be empty')
        }
    }else{
        res.status(401).send('Body request must not be empty');
        throw new Error('Body request must not be empty')
    }
  };

  module.exports.validateFavoriteInput = (title, res) => {
    if(title){
        if (title.trim() === '') {
            res.status(401).send('Name must not be empty');
            throw new Error('Name must not be empty')
        }
    }else{
        res.status(401).send('Body request must not be empty');
        throw new Error('Body request must not be empty')
    }
  };