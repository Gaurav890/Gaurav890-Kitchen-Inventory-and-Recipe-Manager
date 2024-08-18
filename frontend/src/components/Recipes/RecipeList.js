import React, { useState, useEffect } from 'react';
import RecipeItem from './RecipeItem';
import { getRecipes, addRecipe, getInventory, updateRecipe, deleteRecipe, togglePublicStatus } from '../../services/api';
import '../../styles/recipes.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ name: '', instructions: '', ingredients: [] });
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [ingredientList, setIngredientList] = useState([]);
  const [error, setError] = useState('');
  const [editingRecipe, setEditingRecipe] = useState(null);

  // useEffect(() => {
  //   fetchRecipes();
  //   fetchInventory();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesResponse, inventoryResponse] = await Promise.all([
          getRecipes(),
          getInventory()
        ]);
        setRecipes(recipesResponse.data);
        setInventoryItems(inventoryResponse.data);
        console.log('Fetched Inventory:', inventoryResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      }
    };
  
    fetchData();
  }, []);

  const getIngredientName = (itemId) => {
    const item = inventoryItems.find(i => i._id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const fetchRecipes = async () => {
    try {
      console.log('Fetching recipes...');
      const response = await getRecipes();
      console.log('Fetched recipes:', response.data);
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setError('Failed to fetch recipes');
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await getInventory();
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setError('Failed to fetch inventory');
    }
  };

  // const handleAddRecipe = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   if (newRecipe.ingredients.length === 0) {
  //     setError('Please add at least one ingredient to the recipe');
  //     return;
  //   }
  //   try {
  //     console.log('Sending recipe data:', JSON.stringify(newRecipe, null, 2));
  //     const response = await addRecipe(newRecipe);
  //     console.log('Server response:', response);
  //     console.log('Added recipe:', response.data);
  //     setNewRecipe({ name: '', instructions: '', ingredients: [] });
  //     setIngredientList([]);
  //     await fetchRecipes();
  //     await fetchInventory();
  //   } catch (error) {
  //     console.error('Error adding recipe:', error);
  //     setError(error.response?.data?.message || error.message || 'Failed to add recipe');
  //   }
  // };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    setError('');
    if (newRecipe.ingredients.length === 0) {
      setError('Please add at least one ingredient to the recipe');
      return;
    }
    try {
      // Ensure all ingredients have a valid item reference
      const validIngredients = newRecipe.ingredients.filter(ing => ing.item && ing.item !== '');
      if (validIngredients.length !== newRecipe.ingredients.length) {
        setError('All ingredients must have a valid item selected');
        return;
      }
  
      const recipeToSend = {
        ...newRecipe,
        ingredients: validIngredients
      };
  
      console.log('Sending recipe data:', JSON.stringify(recipeToSend, null, 2));
      const response = await addRecipe(recipeToSend);
      console.log('Added recipe:', response.data);
      setNewRecipe({ name: '', instructions: '', ingredients: [] });
      setIngredientList([]);
      await fetchRecipes();
      await fetchInventory();
    } catch (error) {
      console.error('Error adding recipe:', error);
      setError(error.response?.data?.message || error.message || 'Failed to add recipe');
    }
  };

  // const handleAddIngredient = () => {
  //   if (selectedIngredient && selectedQuantity) {
  //     const quantity = parseInt(selectedQuantity, 10);
  //     if (isNaN(quantity) || quantity <= 0) {
  //       setError('Please enter a valid quantity');
  //       return;
  //     }
  //     const newIngredient = { item: selectedIngredient, quantity };
  //     console.log('Adding ingredient:', newIngredient);
  //     setNewRecipe(prev => ({
  //       ...prev,
  //       ingredients: [...prev.ingredients, newIngredient]
  //     }));
  //     setIngredientList([...ingredientList, { selectedIngredient, selectedQuantity }]);
  //     setSelectedIngredient('');
  //     setSelectedQuantity('');
  //   }
  // };

  const handleAddIngredient = () => {
    if (selectedIngredient && selectedQuantity) {
      const quantity = parseInt(selectedQuantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        setError('Please enter a valid quantity');
        return;
      }
      const newIngredient = { 
        item: selectedIngredient, // This should be the ID of the inventory item
        quantity 
      };
      setNewRecipe(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient]
      }));
      setIngredientList([...ingredientList, { 
        selectedIngredient, 
        selectedQuantity,
        name: inventoryItems.find(item => item._id === selectedIngredient)?.name || 'Unknown Item'
      }]);
      setSelectedIngredient('');
      setSelectedQuantity('');
    }
  };

  const handleUpdateRecipe = async (id, updatedRecipe) => {
    try {
      console.log('Updating recipe:', updatedRecipe);
      await updateRecipe(id, updatedRecipe);
      setEditingRecipe(null);
      await fetchRecipes();
      await fetchInventory();
    } catch (error) {
      console.error('Error updating recipe:', error);
      setError('Failed to update recipe');
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe({
      ...recipe,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        item: ing.item._id
      }))
    });
  };

  const handleEditIngredient = (index, field, value) => {
    setEditingRecipe(prev => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: field === 'item' ? value : Number(value)
      };
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const handleAddIngredientToEdit = () => {
    if (selectedIngredient && selectedQuantity) {
      const quantity = parseInt(selectedQuantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        setError('Please enter a valid quantity');
        return;
      }
      setEditingRecipe(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { item: selectedIngredient, quantity }]
      }));
      setSelectedIngredient('');
      setSelectedQuantity('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setEditingRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleTogglePublic = async (id) => {
    try {
      await togglePublicStatus(id);
      await fetchRecipes(); // Refetch recipes to update the list
    } catch (error) {
      console.error('Failed to toggle public status:', error);
      setError('Failed to update recipe public status');
    }
  };
  
  {recipes && recipes.length > 0 ? (
    recipes.map((recipe) => (
      <RecipeItem
        key={recipe._id}
        recipe={recipe}
        inventoryItems={inventoryItems}
        onUpdate={() => handleEditRecipe(recipe)}
        onDelete={() => handleDeleteItem(recipe._id)}
        onTogglePublic={() => handleTogglePublic(recipe._id)}
      />
    ))
  ) : (
    <p>No recipes found.</p>
  )}

  const handleDeleteItem = async (id) => {
    try {
      await deleteRecipe(id);
      await fetchRecipes();
      await fetchInventory();
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  return (
    <div className='recipe-list'>
      <h2>Recipes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddRecipe}>
        <input
          type="text"
          value={newRecipe.name}
          onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
          placeholder="Recipe name"
          required
        />
        <textarea
          value={newRecipe.instructions}
          onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
          placeholder="Instructions"
          required
        />
        <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        <br />
        {
          !!ingredientList && ingredientList.map((item, key) => (
            <div key={key}>{getIngredientName(item.selectedIngredient)} - {item.selectedQuantity}</div>
          ))
        }
        <br />
        <select
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
        >
          <option value="">Select an ingredient</option>
          {inventoryItems.map((item) => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(e.target.value)}
          placeholder="Quantity"
          min="1"
        />
        <button type="submit">Add Recipe</button>
      </form>
      <ul>
        {recipes.map((recipe) => (
          editingRecipe && editingRecipe._id === recipe._id ? (
            <li key={recipe._id}>
              <input
                type="text"
                value={editingRecipe.name}
                onChange={(e) => setEditingRecipe({...editingRecipe, name: e.target.value})}
              />
              <textarea
                value={editingRecipe.instructions}
                onChange={(e) => setEditingRecipe({...editingRecipe, instructions: e.target.value})}
              />
              {editingRecipe.ingredients.map((ing, index) => (
                <div key={index}>
                  <select
                    value={ing.item}
                    onChange={(e) => handleEditIngredient(index, 'item', e.target.value)}
                  >
                    {inventoryItems.map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={ing.quantity}
                    onChange={(e) => handleEditIngredient(index, 'quantity', e.target.value)}
                    min="1"
                  />
                  <button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
                </div>
              ))}
              <div>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                >
                  <option value="">Select an ingredient</option>
                  {inventoryItems.map((item) => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                  placeholder="Quantity"
                  min="1"
                />
                <button type="button" onClick={handleAddIngredientToEdit}>Add Ingredient</button>
              </div>
              <button onClick={() => handleUpdateRecipe(recipe._id, editingRecipe)}>Save</button>
              <button onClick={() => setEditingRecipe(null)}>Cancel</button>
            </li>
          ) : (
            <RecipeItem
              key={recipe._id}
              recipe={recipe}
              inventoryItems={inventoryItems}
              onUpdate={() => handleEditRecipe(recipe)}
              onDelete={() => handleDeleteItem(recipe._id)}
              onTogglePublic={() => handleTogglePublic(recipe._id)}
            />
          )
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;