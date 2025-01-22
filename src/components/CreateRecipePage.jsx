import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CreateRecipePage = () => {
  const location = useLocation();
  const { foodNameList } = location.state;
  const [searchKey, setSearchKey] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [memoryTable, setMemoryTable] = useState([]);

  const filteredFoods = foodNameList.filter((food) =>
    food.description.toLowerCase().includes(searchKey.toLowerCase())
  );
  
  const toggleSearch = () => {
    setIsSearchExpanded((prev) => !prev)};
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

  const handleRemoveIngredient = (fdcid) => {
    setIngredientsList((prevList) => prevList.filter((item) => item.fdcid !== fdcid));
  };

  useEffect(() => {
    const fetchIngredientData = async () => {
      const memoryDataDropdown = await Promise.all(
        ingredientsList.map(async (ingredient) => {
          try {
            const response = await fetch(`http://localhost:5000/api/ingredient_dropdown/${ingredient.fdcid}`);
            const data = await response.json();
            return { fdcid: ingredient.fdcid, data };
          } catch (error) {
            console.error(`Error fetching data for fdcid ${ingredient.fdcid}:`, error);
            return { fdcid: ingredient.fdcid, data: null };
          }
        })
      );

      setMemoryTable(memoryDataDropdown);
    };

    fetchIngredientData();
  }, [ingredientsList]);

  const handleMeasurementChange = (fdcid, selectedOption) => {
    setIngredientsList((prevList) =>
      prevList.map((ingredient) =>
        ingredient.fdcid === fdcid
          ? {
              ...ingredient,
              measurementType: selectedOption,
              grams: selectedOption === 'manual' ? 0 : ingredient.grams,
            }
          : ingredient
      )
    );

    setMemoryTable((prevMemory) =>
      prevMemory.map((entry) =>
        entry.fdcid === fdcid
          ? {
              ...entry,
              data: entry.data.filter((row) => row.disseminationtext === selectedOption),
            }
          : entry
      )
    );
  };

  const handleGramsChange = (fdcid, value) => {
    if (!isNaN(value) && value > 0) {
      setIngredientsList((prevList) =>
        prevList.map((ingredient) => {
          if (ingredient.fdcid === fdcid) {
            const memoryEntry = memoryTable.find((entry) => entry.fdcid === fdcid);
            const selectedConversion = memoryEntry?.data?.find(
              (row) => row.disseminationtext === ingredient.measurementType
            );
  
            let conversionRate = 0;
            let updatedNutrients = [];
  
            // If the measurement type is 'manual', calculate the conversion rate based on grams entered
            if (ingredient.measurementType === 'Enter manual grams') {
              conversionRate = value / 100; // Manual grams conversion
            } else {
              // Otherwise, use the selected conversion from the dropdown
              conversionRate = selectedConversion?.gramweight / 100;
            }
  
            // Calculate updated nutrients based on the conversion rate
            if (selectedConversion) {
              updatedNutrients = selectedConversion.nutrients.map((row) => ({
                ...row,
                nutrient_value: row.nutrient_value * conversionRate,
              }));
            }
  
            // Return updated ingredient with new grams and nutrients
            return { ...ingredient, grams: value, nutrients: updatedNutrients };
          }
          return ingredient;
        })
      );
    }
  };
  
  

  const handleDownloadIngredientData = async () => {
    try {
      const formattedData = await Promise.all(ingredientsList.map(async (ingredient) => {
        const memoryEntry = memoryTable.find((entry) => entry.fdcid === ingredient.fdcid);
        const selectedOption = memoryEntry?.data.find(
          (row) => row.disseminationtext === ingredient.measurementType
        );
  
        let conversionRate = null;
        let nutrients = {};
  
        if (selectedOption && ingredient.grams > 0) {
          // Fetch the ingredient's nutrient data from the backend
          const response = await fetch(`http://localhost:5000/api/ingredient_nutrient_conversion/${ingredient.fdcid}`);
          const nutrientData = await response.json();
  
          // Calculate the conversion rate
          conversionRate = (selectedOption.gramweight * ingredient.grams) / 100;
  
          // Multiply conversionRate with each nutrient's unitvalue
          nutrients = nutrientData.reduce((acc, nutrient) => {
            // Adjusting the nutrient value based on conversion rate
            const adjustedValue = (nutrient.unitvalue * conversionRate).toFixed(2);
            acc[nutrient.nutrientname] = adjustedValue;
            return acc;
          }, {});
        }
  
        return {
          fdcid: ingredient.fdcid,
          name: ingredient.name,
          measurementType: ingredient.measurementType,
          disseminationText: selectedOption ? selectedOption.disseminationtext : null,
          gramWeight: selectedOption ? selectedOption.gramweight : null,
          conversionRate,
          nutrients,
        };
      }));
  
      const jsonData = JSON.stringify(formattedData, null, 2);
  
      // Trigger the file download
      const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ingredient_conversion_data.json';
      link.click();
    } catch (error) {
      console.error('Error downloading ingredient data:', error);
    }
  };
  
  
  
  
  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
    {/* Search Button */}
    <button
      onClick={toggleSearch}
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        padding: '10px 20px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      {isSearchExpanded ? 'Close Search' : '🔍 Search Foods'}
    </button>

    {/* Search Panel */}
    {isSearchExpanded && (
      <div
        style={{
          position: 'fixed',
          top: '50px', // Adjust to be just below the button
          left: '10px',
          width: 'calc(100% - 20px)', // Same width as the button
          maxWidth: '300px', // Restrict maximum width
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 999,
          boxSizing: 'border-box',
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
            boxSizing: 'border-box',
            marginBottom: '10px',
          }}
        />
        {searchKey && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredFoods.map((food) => (
              <button
                key={food.fdcid}
                onClick={() => handleAddIngredient(food)}
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
        )}
      </div>
    )}

    {/* Selected Ingredients Panel */}
    <div
      style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        marginLeft: isSearchExpanded ? '320px' : '10px', // Dynamically adjust margin
        transition: 'margin-left 0.3s ease',
      }}
    >
      <h2>Selected Ingredients</h2>
      {ingredientsList.map((ingredient) => {
        const memoryEntry = memoryTable.find((entry) => entry.fdcid === ingredient.fdcid);
        const disseminationOptions = memoryEntry?.data?.map((row) => row.disseminationtext) || [];

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
              <strong>{ingredient.name}</strong>
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
            <p>{ingredient.description}</p>
            <select
              value={ingredient.measurementType}
              onChange={(e) => handleMeasurementChange(ingredient.fdcid, e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="">Select measurement</option>
              {disseminationOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
              <option value="manual">Enter manual grams</option>
            </select>
            {ingredient.measurementType === 'manual' ? (
              <input
                type="text"
                placeholder="Enter amount in grams"
                value={ingredient.grams}
                onChange={(e) => handleGramsChange(ingredient.fdcid, e.target.value)}
                style={{ padding: '5px', width: '100%' }}
              />
            ) : ingredient.measurementType ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>How many "{ingredient.measurementType}"?</span>
                <input
                  type="text"
                  placeholder={`Enter quantity for ${ingredient.measurementType}`}
                  value={ingredient.grams}
                  onChange={(e) => handleGramsChange(ingredient.fdcid, e.target.value)}
                  style={{ padding: '5px', width: '100%' }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        onClick={handleDownloadIngredientData}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Download Ingredient Conversion Data (JSON)
      </button>
    </div>
  </div>
  );
  
};

export default CreateRecipePage;
