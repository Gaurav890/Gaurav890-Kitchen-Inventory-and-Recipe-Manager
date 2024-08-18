import React, { useState, useEffect } from 'react';
import { getPublicRecipes } from '../services/api';
import './PublicRecipes.css';

const PublicRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicRecipes();
  }, []);

  const fetchPublicRecipes = async () => {
    try {
      const response = await getPublicRecipes();
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch public recipes:', error);
      setError('Failed to load recipes. Please try again later.');
    }
  };

  return (
    <div className="public-recipes">
      <h1>Public Recipes</h1>
      {error && <p className="error">{error}</p>}
      <div className="recipe-list-public">
        {recipes.map(recipe => (
          <div key={recipe._id} className="recipe-card">
            <h2>{recipe.name}</h2>
            <p>By: {recipe.user.username}</p>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>{ing.item.name}: {ing.quantity}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <p>{recipe.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicRecipes;