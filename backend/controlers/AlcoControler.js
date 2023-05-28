const AcloModel = require("../models/alcoModel");
const asyncHandler = require("express-async-handler");

class AlcoControler {
  add = asyncHandler(async (req, res) => {
    const { title, value } = req.body;
    if (!title || !value) {
      res.status(400);
      throw new Error("provide all requred filds");
    }
    const item = await AcloModel.create({ ...req.body });
    return res.status(201).json({ code: 201, message: "success", data: item });
  });

  getAll = asyncHandler(async (req, res) => {
    const items = await AcloModel.find({});
    return res
      .status(200)
      .json({ code: 200, message: "success", data: items, qty: items.length });
  });

  getById(req, res) {
    res.send("getById");
  }
  update(req, res) {
    res.send("update");
  }
  remove(req, res) {
    res.send("remove");
  }
}

module.exports = new AlcoControler();
