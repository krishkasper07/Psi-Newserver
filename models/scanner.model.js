const mongoose=require('mongoose');

const scannerSchema=mongoose.Schema({
    order_number:{
        type:Number,
        required:true
    },
    totalProducts:{
        type : Array , "default" : [] ,
        required:true
    },
    scannedProducts:{
        type : Array , "default" : [] ,
        required:true
    },
    remainingProducts:{
        type : Array , "default" : [] ,
        required:true
    },
   status:{
       type:String, "default" : "pending",
       required:true
   }
})

module.exports=mongoose.model('scanner',scannerSchema);