import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FoodCategory from './FoodCategory';
import SearchFoods from './SearchFoods';
import SelectedIngredients from './SelectedIngredients';
import Instructions from './Instructions';
import SummarizeRecipe from './SummarizeRecipe';

const CreateRecipePage = () => {
  const location = useLocation();
  const { foodNameList } = location.state;
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [memoryTable, setMemoryTable] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  // Extract unique food categories
  const foodCategories = [...new Set(foodNameList.map((food) => food.food_category))];

  const handleAddIngredient = async (food) => {
    const foodExists = ingredientsList.some((ingredient) => ingredient.fdcid === food.fdcid);
  
    if (!foodExists) {
      // Add ingredient to the list
      setIngredientsList((prevList) => [
        ...prevList,
        { fdcid: food.fdcid, description: food.description, grams: '', nutrients: [] },
      ]);
  
      try {
        // Fetch nutrient data for the newly added ingredient
        const response = await fetch(`http://localhost:5000/api/ingredient_nutrient_conversion/${food.fdcid}`);
        if (!response.ok) {
          console.error(`Failed to fetch data for fdcid ${food.fdcid}, Status: ${response.status}`);
          return;
        }
  
        const conversionData = await response.json();
  
        // Update memoryTable with fetched nutrient data
        setMemoryTable((prevTable) => [
          ...prevTable,
          {
            fdcid: food.fdcid,
            description: food.description,
            data: conversionData.map((item) => ({
              nutrientName: item.nutrientname,
              nutrientid: item.nutrientid,
              unitValue: item.unitvalue,
              unitName: item.unitname,
            })),
          },
        ]);
      } catch (err) {
        console.error("Error fetching conversion data:", err);
      }
    } else {
      alert(`${food.description} is already added.`);
    }
  };
  

  const handleRemoveIngredient = (fdcid) => {
    setIngredientsList((prevList) => prevList.filter((item) => item.fdcid !== fdcid));
    setMemoryTable((prevTable) => prevTable.filter((entry) => entry.fdcid !== fdcid)); // Remove from memoryTable
  };

  const handleGramsChange = async (fdcid, value) => {
    if (isNaN(value) || value < 0) {
      return; // Ignore invalid or negative input
    }
  
    try {
      // Fetch conversion data for the given fdcid
      const response = await fetch(`http://localhost:5000/api/ingredient_nutrient_conversion/${fdcid}`);
      if (!response.ok) {
        console.error(`Failed to fetch data for fdcid ${fdcid}`);
        return;
      }
  
      const conversionData = await response.json();
      
      // Calculate the conversion rate based on the entered grams
      const conversionRate = value / 100;
  
      // Update the ingredients list
      setIngredientsList((prevList) =>
        prevList.map((ingredient) => {
          if (ingredient.fdcid === fdcid) {
            // Multiply each nutrient's unitvalue by the conversion rate
            const updatedNutrients = conversionData.map((item) => ({
              nutrientName: item.nutrientname,
              unitValue: item.unitvalue * conversionRate, // Apply conversion rate
              unitName: item.unitname,
              nutrientId: item.nutrientid,
            }));
  
            return { ...ingredient, grams: value, nutrients: updatedNutrients };
          }
          return ingredient;
        })
      );
  
      // Update the memoryTable to include grams
      setMemoryTable((prevTable) => {
        const existingEntryIndex = prevTable.findIndex((entry) => entry.fdcid === fdcid);
        const updatedEntry = {
          fdcid,
          description: conversionData[0]?.description || "Unknown",
          grams: value,  // Include grams here
          data: conversionData.map((item) => ({
            nutrientName: item.nutrientname,
            unitValue: item.unitvalue * conversionRate, // Apply conversion rate
            unitName: item.unitname,
            nutrientid: item.nutrientid,
          })),
        };
  
        if (existingEntryIndex > -1) {
          // Update the existing entry
          return prevTable.map((entry, index) =>
            index === existingEntryIndex ? updatedEntry : entry
          );
        } else {
          // Add a new entry to the memoryTable
          return [...prevTable, updatedEntry];
        }
      });
    } catch (err) {
      console.error("Error fetching conversion data:", err);
    }
  };
  
  
  useEffect(() => {
    console.log("Updated Memory Table:", memoryTable);
  }, [memoryTable]);
  
  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* Toggle Button Above Sidebar */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
      </button>

      {/* Sidebar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          width: isSidebarVisible ? '100%' : '0',
          maxWidth: '600px',
          height: '100%',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          top: '50px', // Pushes the sidebar below the toggle button
          left: isSidebarVisible ? '0px' : '-320px', // Hide sidebar when toggled
          transition: 'left 0.3s ease-in-out',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {/* Food Categories Component */}
          <FoodCategory
            categories={foodCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Search Foods Component */}
          <SearchFoods
            foods={foodNameList}
            onAddIngredient={handleAddIngredient}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          paddingTop: '25px',
          marginLeft: isSidebarVisible ? '650px' : '0px', // Adjust layout when sidebar is hidden
          transition: 'margin-left 0.3s ease',
          height: '100vh',
          
        }}
      >
      <div style={{ flex: 1, padding: '0px' }}>
        <SelectedIngredients
          ingredientsList={ingredientsList}
          memoryTable={memoryTable}
          handleRemoveIngredient={handleRemoveIngredient}
          handleGramsChange={handleGramsChange}
        />
      </div>
    </div>
    {/* <div style={{ marginTop: '20px', overflowX: 'auto' }}>
  <h2>Memory Table (Nutrient Data)</h2>
  {memoryTable.length === 0 ? (
    <p>No nutrient data available.</p>
  ) : (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>FDCID</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Grams</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>NutrientID</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nutrient Name</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Unit Value</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Unit Name</th>
        </tr>
      </thead>
      <tbody>
        {memoryTable.map((entry) =>
          entry.data.map((nutrient, index) => (
            <tr key={`${entry.fdcid}-${index}`}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.fdcid}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.grams || '0'}</td> 
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{nutrient.nutrientid}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.description}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{nutrient.nutrientName}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{nutrient.unitValue}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{nutrient.unitName}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )}
</div> */}

<Instructions />
<SummarizeRecipe />
  </div>
  

  );
  
};

export default CreateRecipePage;
