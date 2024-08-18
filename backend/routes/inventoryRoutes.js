const express = require('express');
const router = express.Router();
const { getInventory, addItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

router.get('/', auth, getInventory);
router.post('/', auth, addItem);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;