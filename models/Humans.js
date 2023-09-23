const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {relationEnums} = require("../enums/relation")

const HumanSchema = new Schema({
    
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    relation: {
        type: String,
        enum: Object.keys(relationEnums).map((key) => relationEnums[key]), 
        default: relationEnums.SILMEDI,
    }

});

module.exports = Human = mongoose.model('humans', HumanSchema);