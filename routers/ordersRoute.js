const orderRoute = require("express").Router();

const axios = require("axios");

const Order = require("../models/orders.model");

const { SHOPIFY_URL } = process.env;

const prefix = process.env.PREFIX;

const openClose = process.env.CLOSEANDOPEN;

const imgUrl = process.env.IMAGEURL;

const getProductDetails = async (product, order_number) => {
  let arr = [];
  product.forEach(async (el) => {
    return arr.push({
      id: arr.length + 1,
      order_number: order_number,
      productName: el.name,
      quantity: el.quantity,
      properties: el.properties,
      imgUrl: `${imgUrl}${el.product_id}`,
      designerNotes: "",
      designerName: "",
      designedDate: "",
      status: "pending",
    });
  });
  return arr;
};

const getorders = async (order) => {
  var orderAlreadyExist = await Order.findOne({
    order_number: order.order_number,
  });

  if (!orderAlreadyExist) {
    let orderToBeSaved = new Order({
      products: await getProductDetails(order.line_items, order.order_number),
      order_number: order.order_number,
      order_id: order.id,
      notes: order.note === null ? "no notes added" : order.note,
      orderDate: order.processed_at,
      deliveryType:
        order.shipping_lines.length > 0
          ? order.shipping_lines[0].title
          : "draft order",
    });
    return orderToBeSaved.save();
  }
};

orderRoute.post("/updateOpenOrders", async (req, res) => {
  try {
    var orders;
    responce = await axios(process.env.URL);
    orders = await responce.data.orders;
    await orders.forEach(async (order) => {
      return getorders(order);
    });
    res.status(200).json("Orders Updated");
  } catch (error) {
    console.log(error);
  }
});

orderRoute.get("/dashOrders", async (req, res) => {
  try {
    let responce = await Order.find().sort({ order_number: -1 });
    res.status(200).json(responce);
  } catch (error) {
    res.status(400).send(error);
  }
});

orderRoute.put("/changeStatus", async (req, res) => {
  let { id, designerName, status, order_number, designedDate } = req.body;
  try {
    var order = await Order.findOneAndUpdate(
      { order_number: order_number, "products.id": id },
      { $set: { "products.$.status": status, "products.$.designerName": designerName, "products.$.designedDate": designedDate } },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

orderRoute.post("/changeNotes", async (req, res) => {
  let id = req.body.id;
  let notes = req.body.notes;
  let order_number = req.body.order_number;
  try {
    var order = await Order.findOneAndUpdate(
      { order_number: order_number, "products.id": id },
      { $set: { "products.$.designerNotes": notes } },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const deleteAllDispatched = async (ordersInDb, ordersInShopify) => {
  try {
    let array1 = [];
    await ordersInDb.forEach((el) => {
      return array1.push(el.order_number);
    });

    let array2 = [];

    await ordersInShopify.forEach((el) => {
      return array2.push(el.order_number);
    });

    let fullfilled = await array1.filter((el) => !array2.includes(el));

    let filter = { order_number: { $in: fullfilled } };

    return await Order.deleteMany(filter);
  } catch (error) {
    console.log(error);
  }
};

orderRoute.delete("/deleteDispatched", async (req, res) => {
  try {
    let ordersInDb = await Order.find();
    let ordersInShopify;
    let responce = await axios(process.env.URL);
    ordersInShopify = responce.data.orders;
    let result = await deleteAllDispatched(ordersInDb, ordersInShopify);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

orderRoute.delete("/deleteMyOrders", async (req, res) => {
  try {
    let result = await Order.deleteMany({});
    res.status(200).json(result);
  } catch (error) {
    console.log(res);
  }
});

orderRoute.post("/getImage", async (req, res) => {
  try {
    let url = req.body.url;
    let IMAGE = prefix;
    let responce = await axios(`${IMAGE}${url.slice(8, 200)}`);
    res.status(200).json(responce.data.images[0].src);
  } catch (error) {
    res.status(400).json(error);
  }
});

orderRoute.post("/fullfill", async (req, res) => {
  try {
    let order_id = req.body.order_id;
    let url = `${openClose}/admin/api/2021-10/orders/${order_id}/close.json`;
    let responce = await axios
      .post(url)
      .then((res) => res)
      .catch((err) => err);
    res.status(200).json(responce);
  } catch (error) {
    res.status(400).json(error);
  }
});

orderRoute.post("/unfullfill", async (req, res) => {
  try {
    let order_id = req.body.order_id;
    let url = `${openClose}/admin/api/2021-10/orders/${order_id}/open.json`;
    let responce = await axios
      .post(url)
      .then((res) => res)
      .catch((err) => err);
    res.status(200).json(responce);
  } catch (error) {
    res.status(400).json(error);
  }
});

orderRoute.get("/openOrders", async (req, res) => {
  try {
    let responce = await axios.get(process.env.URL);
    let result = await responce.data.orders;
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

orderRoute.get("/anyOrders", async (req, res) => {
  try {
    let responce = await axios.get(SHOPIFY_URL);
    let result = await responce.data.orders;
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

orderRoute.get("/returnDispatched",async (req,res)=>{
  try {
    let ordersInDb = await Order.find();
    let ordersInShopify;
    let responce = await axios(process.env.URL);
    ordersInShopify = responce.data.orders;
    let result=await getAllDispatched(ordersInDb, ordersInShopify);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
})

const getAllDispatched=async(ordersInDb,ordersInShopify)=>{
  try {
    let array1 = [];
    await ordersInDb.forEach((el) => {
      return array1.push(el.order_number);
    });

    let array2 = [];

    await ordersInShopify.forEach((el) => {
      return array2.push(el.order_number);
    });

    let fullfilled = await array1.filter((el) => !array2.includes(el));

    console.log(fullfilled.length)

    let filter = { order_number: { $in: fullfilled } };

    return await Order.find(filter);
  } catch (error) {
    console.log(error);
  }
}

module.exports = orderRoute;
