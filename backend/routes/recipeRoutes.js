const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

// Public route (no authentication required)
router.get('/public', recipeController.getPublicRecipes);

// Authenticated routes
router.get('/', auth, recipeController.getRecipes);
router.post('/', auth, recipeController.addRecipe);
router.put('/:id', auth, recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);
router.patch('/:id/togglePublic', auth, recipeController.togglePublicStatus);

module.exports = router;