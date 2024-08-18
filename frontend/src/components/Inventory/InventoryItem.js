import React, { useState } from 'react';
import '../../styles/inventory.css';

const InventoryItem = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = () => {
    onUpdate(item._id, editedItem);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
          />
          <input
            type="number"
            value={editedItem.quantity}
            onChange={(e) => setEditedItem({ ...editedItem, quantity: Number(e.target.value) })}
          />
          <input
            type="text"
            value={editedItem.unit}
            onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{item.name} - {item.quantity} {item.unit}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default InventoryItem;