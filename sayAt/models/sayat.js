let mongoose = require('mongoose')
let moment = require('moment')

const Schema =  mongoose.Schema

let sayatSchema = new Schema({
    description: {type:String, required: true},
    date_added: {type:Date, default:Date.now},
    likes: {type:Number, default:0},
    dislikes: {type:Number, default:0}
})

sayatSchema.virtual('date_added_formatted').get(function(){
    return moment(this.date_added).format("MMMM  Do H:m YYYY")
})

module.exports = mongoose.model('sayat', sayatSchema)