const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const { InventoryItem } = require('../models/InventoryItem');

// exports.getRecipes = async (req, res) => {
//   try {
//     const recipes = await Recipe.find({ user: req.user._id }).populate('ingredients.item');
//     res.json(recipes);
//   } catch (error) {
//     console.error('Error fetching recipes:', error);
//     res.status(500).json({ message: 'Error fetching recipes', error: error.message });
//   }
// };

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).populate('ingredients.item');
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

exports.getPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublic: true })
      .populate('user', 'username')
      .populate('ingredients.item', 'name');
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching public recipes:', error);
    res.status(500).json({ message: 'Error fetching public recipes', error: error.message });
  }
};

exports.togglePublicStatus = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    recipe.isPublic = !recipe.isPublic;
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error('Error toggling recipe public status:', error);
    res.status(400).json({ message: 'Error updating recipe', error: error.message });
  }
};

exports.addRecipe = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Received recipe data:', req.body);
    const { name, instructions, ingredients } = req.body;

    // Validate input
    if (!name || !instructions || !ingredients || !Array.isArray(ingredients)) {
      throw new Error('Invalid recipe data');
    }

    // Check and update inventory
    for (const ing of ingredients) {
      const inventoryItem = await InventoryItem.findOne({ _id: ing.item, user: req.user._id }).session(session);
      
      if (!inventoryItem) {
        throw new Error(`Ingredient with id ${ing.item} not found in inventory`);
      }

      console.log(`Current inventory for ${inventoryItem.name}: ${inventoryItem.quantity}`);

      if (inventoryItem.quantity < ing.quantity) {
        throw new Error(`Not enough ${inventoryItem.name} in inventory. Required: ${ing.quantity}, Available: ${inventoryItem.quantity}`);
      }

      inventoryItem.quantity -= ing.quantity;
      await inventoryItem.save({ session });
      console.log(`Updated inventory for ${inventoryItem.name}: ${inventoryItem.quantity}`);
    }

    // Create and save the recipe
    const recipe = new Recipe({
      name,
      instructions,
      ingredients,
      user: req.user._id,
      isPublic: req.body.isPublic || false  // Add this line
    });
    await recipe.save({ session });
    console.log('Saved recipe:', recipe);

    await session.commitTransaction();
    console.log('Transaction committed successfully');
    res.status(201).json(recipe);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in addRecipe:', error);
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.updateRecipe = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldRecipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id }).session(session);
    if (!oldRecipe) {
      throw new Error('Recipe not found');
    }

    const { name, instructions, ingredients, isPublic } = req.body;

    // Revert old recipe ingredients
    for (const ing of oldRecipe.ingredients) {
      await InventoryItem.findOneAndUpdate(
        { _id: ing.item, user: req.user._id },
        { $inc: { quantity: ing.quantity } },
        { session, new: true }
      );
    }

    // Check and update for new recipe ingredients
    for (const ing of ingredients) {
      const inventoryItem = await InventoryItem.findOne({ _id: ing.item, user: req.user._id }).session(session);
      if (!inventoryItem) {
        throw new Error(`Ingredient with id ${ing.item} not found in inventory`);
      }
      if (inventoryItem.quantity < ing.quantity) {
        throw new Error(`Not enough ${inventoryItem.name} in inventory. Required: ${ing.quantity}, Available: ${inventoryItem.quantity}`);
      }
      await InventoryItem.findOneAndUpdate(
        { _id: ing.item, user: req.user._id },
        { $inc: { quantity: -ing.quantity } },
        { session, new: true }
      );
    }

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, instructions, ingredients, isPublic },  // Add isPublic here
      { new: true, runValidators: true, session }
    ).populate('ingredients.item');

    await session.commitTransaction();
    res.json(updatedRecipe);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating recipe:', error);
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.deleteRecipe = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id }).session(session);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Return ingredients to inventory
    for (const ing of recipe.ingredients) {
      await InventoryItem.findOneAndUpdate(
        { _id: ing.item, user: req.user._id },
        { $inc: { quantity: ing.quantity } },
        { session, new: true }
      );
    }

    await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user._id }).session(session);

    await session.commitTransaction();
    res.json(recipe);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};