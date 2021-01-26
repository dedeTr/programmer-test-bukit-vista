const Sequelize = require('sequelize');

const sequalize = new Sequelize('sqlite:user.db')

module.exports = sequalize.define('user',{
    user_id: {
        field: 'user_id',
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    name : {
        field: 'name',
        type: Sequelize.STRING
    },
    password : {
        field: 'password',
        type: Sequelize.STRING
    }
},{
    timestamps: false
})

