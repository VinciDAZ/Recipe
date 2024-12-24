import React from 'react';
import AuthPageInput from './AuthPageInput';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login () {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState({
    username: "",
    password: "",
  })

  const [foodData, setFoodData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);


  const handleSubmit = async (event) => {  
    event.preventDefault();

    if (userInfo.username && userInfo.password) {
      try {
        // Send a POST request to the login endpoint
        const response = await axios.post("http://localhost:5000/login", userInfo);

        if (response.data.success) {
          console.log("Login successful:", response.data);
          // Redirect to the home page
          navigate("/home");
        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        alert(error.response?.data || "Login failed. Please try again.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  const handleChange = (event) => {
    const {value, name} = event.target;

    setUserInfo(prevValue => {
        return{
          ...prevValue,
            [name] : value
        };
      
    } )
  }

  const handleRegister = (event) => {
    event.preventDefault();
    navigate("/register")
    
  }

  const handleRecover = (event) => {
    event.preventDefault();
    navigate("/recover")
  }
  

  const fetchAndDownload = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fetchUSDAData");
  
      // Process and filter the response data as needed
      const filteredData = response.data.map((item) => ({
        fdcId: item.fdcId,
        description: item.description,
        foodCategory: item.foodCategory,
        servingSize: item.servingSize,
        commonNames: item.commonNames,
        foodNutrients: item.foodNutrients.map((nutrient) => ({
          nutrientId: nutrient.nutrientId,
          nutrientName: nutrient.nutrientName,
          nutrientNumber: nutrient.nutrientNumber,
          unitName: nutrient.unitName,
          foodNutrientId: nutrient.foodNutrientId,
          value: nutrient.value,
        })),
        finalFoodInputFoods: item.finalFoodInputFoods,
        foodMeasures: item.foodMeasures
      }));
  
      // Convert the filtered data to a Blob
      const jsonData = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
  
      // Create a download link
      const link = document.createElement("a");
      link.href = url;
      link.download = "USDA_Food_Data.json";
      link.click();
  
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching USDA data:", error.message);
    }
  };
  
      return (
       <div className="login-container">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              
              <AuthPageInput 
                type="text"
                id="username"
                name="username"
                placeholder="username"
                value={userInfo.username}
                onChange={handleChange}
              />
          
              <AuthPageInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  value={userInfo.password}
                  onChange={handleChange}
              />
              
              <button type="submit" className="login-button">
                Login
              </button>

              <button onClick ={handleRegister} type="register" className="register-button">
                Create new account
                </button>
            </form>
            <div className="forgot-account">
          <a
            href="#"
            onClick={handleRecover}
            className="forgot-account-link"
          >
            Forgot Account?
          </a>
        </div>
      
          </div>
          <button onClick={fetchAndDownload} style={{ padding: "10px", fontSize: "16px" }}>
      Fetch USDA Data
    </button>
        </div>)
    } 
      ;
    
    
    export default Login