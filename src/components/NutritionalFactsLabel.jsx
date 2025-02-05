import React from 'react';

const NutritionalFactsLabel = ({ memoryTable }) => {
  // Aggregate nutrient values by nutrientId
  const aggregatedNutrients = memoryTable.reduce((acc, entry) => {
    entry.data.forEach((nutrient) => {
      if (!acc[nutrient.nutrientId]) {
        acc[nutrient.nutrientId] = {
          name: nutrient.nutrientName,
          unit: nutrient.unitName,
          value: 0,
        };
      }
      acc[nutrient.nutrientId].value += nutrient.unitValue;
    });
    return acc;
  }, {});

  // Define the order and labels for key nutrients
  const nutrientOrder = [

    { id: 1003, label: "Protein" },
    { id: 1004, label: "Total Fat" },
    { id: 1258, label: "Saturated Fat" },
    { id: 1293, label: "Polyunsaturated Fat" },
    { id: 1292, label: "Monounsaturated Fat" },
    { id: 1005, label: "Total Carbohydrate" },
    { id: 1079, label: "Dietary Fiber" },
    { id: 1093, label: "Sodium" },
    { id: 1063, label: "Total Sugars" },
    { id: 1253, label: "Cholesterol" },
  ];

  return (
    <div style={{
      width: '300px',
      border: '2px solid black',
      padding: '10px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', fontSize: '18px' }}>Nutrition Facts</h2>
      <hr style={{ borderTop: '4px solid black' }} />

      {/* Serving Size Placeholder */}
      <p><strong>Serving Size:</strong> 100g</p>
      <hr />

      {/* Calories */}
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Calories: {aggregatedNutrients[2048]?.value?.toFixed(2) || 0}
      </p>
      <hr style={{ borderTop: '2px solid black' }} />

      {/* Display each nutrient */}
      {nutrientOrder.map(({ id, label }) => (
        <p key={id} style={{ fontSize: '14px', margin: '5px 0' }}>
          <strong>{label}:</strong> {aggregatedNutrients[id]?.value?.toFixed(2) || 0} {aggregatedNutrients[id]?.unit || ''}
        </p>
      ))}
    </div>
  );
};

export default NutritionalFactsLabel;
