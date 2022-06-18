const joi=require('joi');

const customerValidater=(body)=>{
    const schema = joi.object({
        customerName: joi.string().required().min(3).label("Customer Name"),
        phone:joi.string().required().label("phone number"),
      });
      return schema.validate(body);
}

module.exports={customerValidater};