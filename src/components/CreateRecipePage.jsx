import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const CreateRecipePage = () => {
  const location = useLocation();
  const { foodNameList } = location.state;
  const [searchKey, setSearchKey] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);

  // Filter foods based on search input
  const filteredFoods = foodNameList.filter((food) =>
    food.description.toLowerCase().includes(searchKey.toLowerCase())
  );

  // Add selected ingredient to the list if it doesn't already exist
  const handleAddIngredient = (food) => {
    const foodExists = ingredientsList.some((ingredient) => ingredient.fdcid === food.fdcid);
    
    if (!foodExists) {
      setIngredientsList((prevList) => [
        ...prevList,
        { fdcid: food.fdcid, name: food.name, description: food.description, measurementType: '', grams: 0 },
      ]);
    } else {
      alert(`${food.name} is already added.`);
    }
  };

  // Remove ingredient from the list
  const handleRemoveIngredient = (fdcid) => {
    setIngredientsList((prevList) => prevList.filter((item) => item.fdcid !== fdcid));
  };

  // Handle dropdown change (either manual grams or preselected amount)
  const handleMeasurementChange = (fdcid, value) => {
    setIngredientsList((prevList) =>
      prevList.map((ingredient) =>
        ingredient.fdcid === fdcid ? { ...ingredient, measurementType: value } : ingredient
      )
    );
  };

  // Handle manual grams input change
  const handleGramsChange = (fdcid, value) => {
    setIngredientsList((prevList) =>
      prevList.map((ingredient) =>
        ingredient.fdcid === fdcid ? { ...ingredient, grams: value } : ingredient
      )
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left half of the page for the gallery */}
      <div
        style={{
          width: '50%',
          padding: '20px',
          overflowY: 'auto',
          maxHeight: '100vh',
          alignItems: 'flex-start',
        }}
      >
        <input
          type="text"
          placeholder="Search foods..."
          value={searchKey}
          onChange={(event) => setSearchKey(event.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        />

        {searchKey && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            {filteredFoods.map((food) => (
              <button
                key={food.fdcid}
                onClick={() => handleAddIngredient(food)}
                style={{
                  padding: '20px',
                  fontSize: '16px',
                  width: '100%',
                  height: '120px',
                  textAlign: 'center',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
              >
                <h4>{food.name}</h4>
                <p style={{ fontSize: '14px' }}>{food.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right half for selected ingredients */}
      <div
        style={{
          width: '50%',
          padding: '20px',
          backgroundColor: '#fff',
          overflowY: 'auto',
        }}
      >
        <h2>Selected Ingredients</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          {ingredientsList.map((ingredient) => (
            <div
              key={ingredient.fdcid}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span>
                <strong>{ingredient.name}</strong>: {ingredient.description}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Dropdown for selecting measurement type */}
                <select
                  value={ingredient.measurementType}
                  onChange={(e) => handleMeasurementChange(ingredient.fdcid, e.target.value)}
                  style={{ padding: '5px', fontSize: '14px' }}
                >
                  <option value="">Select measurement</option>
                  <option value="manual">Enter manual grams</option>
                  <option value="preselected">Preselected amount</option>
                </select>

                {/* If manual grams is selected, show the input */}
                {ingredient.measurementType === 'manual' && (
                  <input
                    type="number"
                    placeholder="Grams"
                    value={ingredient.grams}
                    onChange={(e) => handleGramsChange(ingredient.fdcid, e.target.value)}
                    style={{ padding: '5px', fontSize: '14px' }}
                  />
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => handleRemoveIngredient(ingredient.fdcid)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;
