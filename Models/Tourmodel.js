const mongoose = require('mongoose')

const Tourschema =  new mongoose.Schema({
    Title:{
      type:String,
      require:true,
      unique:true
    },
    Description:{
      type:String,
      require:true,
      unique:true
    },
    Price:{
      type:String,
      require:true
    },
   Availabedate:{
    type:String,
    require:true
   },
    Image:{
        type:String,
        require:true
    }
  })
const Tourpackages = mongoose.model('Tourpackages',Tourschema)
module.exports = Tourpackages
