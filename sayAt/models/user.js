let mongoose = require('mongoose')
let moment = require('moment')

const Schema =  mongoose.Schema

let sayatSchema = require('./sayat')

const UserSchema = new Schema({
    email: {type:String},
    password: {type:String},
    name: {type:String, required:true},
    sayats: [sayatSchema.schema],
    date_added: {type: Date, default:Date.now()}
})

UserSchema.virtual('added_date').get(function(){
    return this.data_added
})

UserSchema.virtual('sayat_list').get(function(){
    return this.sayats
})

UserSchema.virtual('url').get(function(){
    return this._id
})

exports.sayat_schema = sayatSchema

module.exports = mongoose.model('user', UserSchema)