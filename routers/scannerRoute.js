const scannerRouter = require("express").Router();

const Scanner = require("../models/scanner.model");

scannerRouter.get("/scannerDb", (req, res) => {
  try {
    Scanner.find((err, docs) => {
      if (err) console.log(err);
      res.json(docs);
    });
  } catch (error) {
    console.log(error);
  }
});

scannerRouter.post("/add", async (req, res) => {
  const order_number = req.body.order_number;
  const scannedBy = req.body.scannedBy;
  const scanner = new Scanner({
    order_number: order_number,
    scannedBy: scannedBy,
  });

  const orderExistInDb = await Scanner.findOne({ order_number: order_number });

  try {
    if (!orderExistInDb) {
      await scanner.save();
      res.json(scanner);
    } else {
      res.json("order already present..");
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

scannerRouter.put("/update", async (req, res) => {
  const order_number = req.body.order_number;
  const scannedBy = req.body.scannedBy;
  const scanned = req.body.scanned;
  const remaining = req.body.remaining;
  const status = req.body.status;
  const totalProducts = req.body.totalProducts;
  const lastScanned = new Date();
  const filter = { order_number: order_number };

  const update = {
    scannedBy: scannedBy,
    scanned: scanned,
    remaining: remaining,
    lastScanned,
    lastScanned,
    status: status,
    totalProducts: totalProducts,
  };

  try {
    const orderToBeUpdated = await Scanner.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.json(
      orderToBeUpdated === null
        ? "please provide correct order_number"
        : "order as been updated in the db"
    );
  } catch (error) {
    res.json(error);
  }
});

scannerRouter.delete("/delete:id", async (req, res) => {
  const id = req.params.id;
  try {
    const orderToBeDeleted = await Scanner.findByIdAndDelete(id);
    res.json(
      orderToBeDeleted === null
        ? "please provide correct id"
        : "order as been deleted from the db"
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = scannerRouter;
