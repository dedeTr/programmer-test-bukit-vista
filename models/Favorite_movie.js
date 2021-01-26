const Sequelize = require('sequelize');

const sequalize = new Sequelize('sqlite:user.db')

module.exports = sequalize.define('favorite_movie',{
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        field: 'title',
        type: Sequelize.STRING
    },
    user_id: {
        field: 'user_id',
        type: Sequelize.INTEGER,
    }
},{
    timestamps: false
})