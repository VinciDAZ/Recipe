import React from 'react';

const SelectedIngredients = ({
  ingredientsList,
  memoryTable,
  handleRemoveIngredient,
  handleGramsChange,
  isSidebarVisible, // Pass down the visibility state of the sidebar
}) => {
  return (
    <div>
      <h2>Selected Ingredients</h2>
      {ingredientsList.map((ingredient) => {
        const memoryEntry = memoryTable.find((entry) => entry.fdcid === ingredient.fdcid);
        console.log(memoryEntry?.data);
        return (
          <div
            key={ingredient.fdcid}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{ingredient.description}</strong>
              <button
                onClick={() => handleRemoveIngredient(ingredient.fdcid)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#e74c3c',
                  cursor: 'pointer',
                }}
              >
                🗑️
              </button>
            </div>
            {/* Removed the measurement dropdown */}
            <input
              type="text"
              placeholder="Enter amount in grams"
              value={ingredient.grams}
              onChange={(e) => handleGramsChange(ingredient.fdcid, e.target.value)}
              style={{ padding: '5px', width: '100%' }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SelectedIngredients;
