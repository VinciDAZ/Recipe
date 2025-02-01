import React, { useState } from 'react';

const SearchFoods = ({ foods, onAddIngredient, selectedCategory }) => {
  const [searchKey, setSearchKey] = useState('');

  // Filter foods based on search key and category
  const filteredFoods = foods.filter(
    (food) =>
      food.description.toLowerCase().includes(searchKey.toLowerCase()) &&
      (selectedCategory === '' || food.food_category === selectedCategory)
  );

  return (
    <div style={{ flex: 1}}>
      <input
        type="text"
        placeholder="Search foods..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          fontSize: '16px',
          boxSizing: 'border-box',
          marginBottom: '10px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredFoods.map((food) => (
          <button
            key={food.fdcid}
            onClick={() => onAddIngredient(food)}
            style={{
              padding: '10px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {food.description}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFoods;
