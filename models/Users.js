const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Userschema = new Schema({
    
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

});

module.exports = User = mongoose.model('users', Userschema);