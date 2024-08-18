import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);

// Recipes
export const getRecipes = () => api.get('/recipes');
export const addRecipe = (recipeData) => api.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => api.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);

// Inventory
export const getInventory = () => api.get('/inventory');
export const addInventoryItem = (itemData) => api.post('/inventory', itemData);
export const updateInventoryItem = (id, itemData) => api.put(`/inventory/${id}`, itemData);
export const deleteInventoryItem = (id) => api.delete(`/inventory/${id}`);

export const getPublicRecipes = () => api.get('/recipes/public');
export const togglePublicStatus = (id) => api.patch(`/recipes/${id}/togglePublic`);

export default api;