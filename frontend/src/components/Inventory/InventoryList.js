import React, { useState, useEffect } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../../services/api';
import '../../styles/inventory.css';

const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, unit: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await getInventory();
      setInventoryItems(response.data);
    } catch (error) {
      setError('Failed to fetch inventory');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addInventoryItem(newItem);
      setNewItem({ name: '', quantity: 0, unit: '' });
      fetchInventory();
    } catch (error) {
      setError('Failed to add item');
    }
  };

  const handleUpdateItem = async (id, updatedItem) => {
    try {
      await updateInventoryItem(id, updatedItem);
      fetchInventory();
    } catch (error) {
      setError('Failed to update item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventoryItem(id);
      fetchInventory();
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  return (
    <div className='inventory-list'>
      <h2>Inventory</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Item name"
          required
        />
        <input
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          placeholder="Quantity"
          required
        />
        <input
          type="text"
          value={newItem.unit}
          onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          placeholder="Unit"
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {inventoryItems.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} {item.unit}
            <button onClick={() => handleUpdateItem(item._id, { ...item, quantity: item.quantity + 1 })}>+</button>
            <button onClick={() => handleUpdateItem(item._id, { ...item, quantity: Math.max(0, item.quantity - 1) })}>-</button>
            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;