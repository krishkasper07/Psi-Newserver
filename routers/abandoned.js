const Abandoned = require("express").Router();

const axios = require("axios");

const abandonedUrl = process.env.ABANDONEDURL;

const Customer = require("../models/abandonedCustomer");

const {customerValidater} = require("../utils/verifyCustomer");

Abandoned.get("/", async (req, res) => {
  try {
    let response = await axios(abandonedUrl);
    let result = await response.data.checkouts;
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

Abandoned.post("/saveCustomer", async (req, res) => {
  let {
    abandoned_checkout_url,
    customerName,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    phone,
    lastOrderPricing,
  } = req.body;
  try {
    let customerAlreadyExist = await Customer.findOne({ phone: phone });
    if (!customerAlreadyExist) {
      let customerToBeSaved = new Customer({
        abandoned_checkout_url: abandoned_checkout_url,
        customerName: customerName,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        country: country,
        zip: zip,
        phone: phone,
        lastOrderPricing: lastOrderPricing,
      });
      customerToBeSaved.save();
      res.status(200).json("Customer Saved Sucessfully..!");
    } else {
      res.status(200).send("Customer Already Saved..!");
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

Abandoned.post("/addCustomer", async (req, res) => {
  let {
    abandoned_checkout_url,
    customerName,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    phone,
    lastOrderPricing,
  } = req.body;
  try {
    const { error } = customerValidater({customerName,phone});

    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    let customerAlreadyExist = await Customer.findOne({ phone: phone });
    if (!customerAlreadyExist) {
      let customerToBeSaved = new Customer({
        abandoned_checkout_url: abandoned_checkout_url,
        customerName: customerName,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        country: country,
        zip: zip,
        phone: phone,
        lastOrderPricing: lastOrderPricing,
      });
      customerToBeSaved.save();
      res.status(200).json("Customer Saved Sucessfully..!");
    }else {
      res.status(200).send("Customer Already Saved..!");
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

Abandoned.put("/updateCustomer/:id", async (req, res) => {
  let id = req.params.id;
  let update = {
    abandoned_checkout_url: req.body.abandoned_checkout_url,
    customerName: req.body.customerName,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    zip: req.body.zip,
    phone: req.body.phone,
    lastOrderPricing: req.body.lastOrderPricing,
    notes:req.body.notes
  };
  try {
    updatedCustomer = await Customer.findByIdAndUpdate({_id:id}, update,{
      rawResult: true,
    });
    if(updatedCustomer.ok){
        res.status(200).json('customer Updated Sucessfully');
    }
  }catch (error) {
    res.status(400).json(error);
  }
});


Abandoned.delete('/delete/:id',async(req,res)=>{
    let id = req.params.id;
    try {
      let deletedCustomer=await Customer.findByIdAndDelete({_id:id})
       if(deletedCustomer){
        res.status(200).json('Customer Details Deleted Successfully');
       }else{
        res.status(200).json('customer Details doesnt match');
       }
     
    } catch (error) {
        res.status(400).json(error);
    }
})

Abandoned.get("/savedCustomers", async (req, res) => {
  try {
    let responce = await Customer.find().sort({ order_number: -1 });
    res.status(200).json(responce);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = Abandoned;
