const mongoose= require('mongoose')

mongoose.connect(`mongodb://localhost:27017/appptest`)

const userSchema=mongoose.Schema({   // this is a methos


    name:String,
    email:String,
    username:String

})


module.exports = mongoose.model("user",userSchema); // here jo user hai naa wo database me uska plural hoga


