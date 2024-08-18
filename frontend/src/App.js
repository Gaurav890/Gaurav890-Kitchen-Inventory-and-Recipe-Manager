import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Homepage from './components/Homepage';
import PublicRecipes from './components/PublicRecipes';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import InventoryList from './components/Inventory/InventoryList';
import RecipeList from './components/Recipes/RecipeList';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} index />
            <Route path="/public-recipes" element={<PublicRecipes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/recipes" element={<RecipeList />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;