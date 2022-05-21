const mongoose=require('mongoose');

const scannerSchema=mongoose.Schema({
    order_number:{
        type:Number
    },
    totalProducts:{
        type : Array , "default" : [] 
    },
    scannedProducts:{
        type : Array , "default" : [] 
    },
    remainingProducts:{
        type : Array , "default" : [] 
    },
   status:{
       type:String
   }
})

module.exports=mongoose.model('scanner',scannerSchema);