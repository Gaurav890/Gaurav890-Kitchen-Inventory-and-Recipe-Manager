import React, { useEffect, useState } from 'react';

const RecipeItem = ({ recipe, inventoryItems, onUpdate, onDelete, onTogglePublic }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  if (!recipe) {
    return null;
  }

  useEffect(() => {
    console.log(recipe)
  }, [])

  const getIngredientName = (itemId) => {
    const item = inventoryItems.find(i =>i && i._id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const handleSave = () => {
    onUpdate(recipe._id, editedRecipe);
    setIsEditing(false);
  };

  return (
    <div className="recipe-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedRecipe.name}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
          />
          <textarea
            value={editedRecipe.instructions}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, instructions: e.target.value })}
          />
          {/* You might want to add ingredient editing functionality here */}
          {
            
          }
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{recipe.name}</h3>
          <p>Instructions: {recipe.instructions}</p>
          <h4>Ingredients:</h4>
          <ul>
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.item ? getIngredientName(ing.item._id || ing.item) : 'Unknown Item'} - {ing.quantity}
              </li>
            ))}
          </ul>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(recipe._id)}>Delete</button>
          <button onClick={() => onTogglePublic(recipe._id)}>
            {recipe.isPublic ? 'Make Private' : 'Make Public'}
          </button>
        </>
      )}
    </div>
  );
};

export default RecipeItem;