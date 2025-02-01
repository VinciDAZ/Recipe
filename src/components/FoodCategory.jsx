import React from 'react';


const FoodCategory = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
      <button
        onClick={() => onSelectCategory('')}
        style={{
          padding: '10px',
          backgroundColor: selectedCategory === '' ? '#4a90e2' : '#fff',
          color: selectedCategory === '' ? '#fff' : '#000',
          border: '1px solid #4a90e2',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        All Categories
      </button>
      {categories.map((category, idx) => (
        <button
          key={idx}
          onClick={() => onSelectCategory(category)}
          style={{
            padding: '10px',
            backgroundColor: selectedCategory === category ? '#4a90e2' : '#fff',
            color: selectedCategory === category ? '#fff' : '#000',
            border: '1px solid #4a90e2',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FoodCategory