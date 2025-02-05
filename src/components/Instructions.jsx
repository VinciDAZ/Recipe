import React, { useState } from 'react';

const Instructions = () => {
  const [steps, setSteps] = useState(['']); // Array to store instructions
  const [idCount, setIdCount] = useState(1); // To keep track of delete button ids

  const handleAddStep = () => {
    setSteps((prevSteps) => [...prevSteps, '']);
    setIdCount((prevCount) => prevCount + 1); // Increment idCount to avoid duplicate keys
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const handleRemoveStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  const handleFinishRecipe = () => {
    // Create the instructionsJSON
    const instructionsJSON = {
      steps: steps.map((step, index) => ({
        stepNumber: index + 1,
        instruction: step
      }))
    };

    // Log the instructionsJSON to console
    console.log("Instructions JSON:", JSON.stringify(instructionsJSON, null, 2));

    localStorage.setItem("storedInstructions", JSON.stringify(instructionsJSON));
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Instructions</h2>
      <div>
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              style={{ padding: '10px', width: '80%', marginRight: '10px' }}
            />
            {index > 0 && (
              <button
                onClick={() => handleRemoveStep(index)}
                style={{
                  backgroundColor: 'white',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddStep}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Next Step
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleFinishRecipe}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Finish Recipe
        </button>
      </div>
    </div>
  );
};

export default Instructions;
