const { InventoryItem } = require('../models/InventoryItem');

exports.getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find({ user: req.user._id });
    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addItem = async (req, res) => {
  try {
    const item = new InventoryItem({
      ...req.body,
      user: req.user._id
    });
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await InventoryItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).send();
    res.send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await InventoryItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).send();
    res.send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};