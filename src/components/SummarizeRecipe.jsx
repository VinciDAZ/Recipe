import React, { useState } from 'react';

const SummarizeRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [occasion, setOccasion] = useState('');
  const [nationality, setNationality] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleCompleteRecipe = async () => {
    // Retrieve userId from localStorage
    const storedUserInfo = localStorage.getItem("userId");

    // Create recipe data object
    const recipeData = {
      userId: storedUserInfo, // Retrieve userId from localStorage
      recipeName: recipeName,
      purpose: purpose,
    };
    console.log( recipeData)
    try {
      // Send POST request to backend to insert the recipe
      const response = await fetch("http://localhost:5000/complete-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Recipe saved:", data.recipe);
      } else {
        console.error("Error saving recipe:", data.error);
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Summarize Your Recipe</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Recipe Name:
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Enter recipe name"
            style={{ padding: '10px', marginLeft: '10px', width: '200px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            <option value="">Select Category</option>
            <option value="Fish and Shellfish">Fish and Shellfish</option>
            <option value="Meat">Meat</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Dessert">Dessert</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Occasion:
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            <option value="">Select Occasion</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Holiday">Holiday</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Nationality:
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            <option value="">Select Nationality</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
            <option value="Japanese">Japanese</option>
            <option value="French">French</option>
            <option value="Chinese">Chinese</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Purpose:
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            <option value="">Select Purpose</option>
            <option value="Share">Share with Friends and Family</option>
            <option value="Calorie">Calorie Counter</option>
          </select>
        </label>
      </div>

      <div>
        <button
          onClick={handleCompleteRecipe}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Complete Recipe
        </button>
      </div>
    </div>
  );
};

export default SummarizeRecipe;
