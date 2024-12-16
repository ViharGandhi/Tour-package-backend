const mongoose = require('mongoose')

const CustomerPacakge = new mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        required:true,
    },
    Phonenumber:{
        type:Number,
        require:true
    },
    Travelers:{
        type:Number,
        require:true
    },
    Totalcost:{
        type:Number,
        require:true,
    },
    SpecialRequest:{
        type:String,
        require:true
    },
    
    PackageId:{
        type:String,
        require:true
    }
})
const Customer = mongoose.model('Customer',CustomerPacakge) 
module.exports = Customer
