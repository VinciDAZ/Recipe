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

  const [loading, setLoading] = React.useState(false);


  const handleSubmit = async (event) => {  
    event.preventDefault();

    if (userInfo.username && userInfo.password) {
      try {
        // Send a POST request to the login endpoint
        const response = await axios.post("http://localhost:5000/login", userInfo);

        if (response.data.success) {
          console.log("Login successful:", response.data);

          const userId = response.data.userId;
          localStorage.setItem("userId", userId);
          const storedUserId = localStorage.getItem('userId');
          // Save userId to localStorage
          console.log("User ID from stored:", storedUserId);
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
  
  const fetchAndInsert = async () => {
    try {
      setLoading(true); // Optionally show a loading state
      const response = await axios.get("http://localhost:5000/refreshUSDAData");
  
      if (response.data.success) {
        alert("USDA data successfully inserted into the database!");
      } else {
        alert("Data insertion failed. Please check the backend logs for details.");
      }
    } catch (error) {
      console.error("Error inserting USDA data:", error.message);
      alert("An error occurred while inserting USDA data. Please try again later.");
    } finally {
      setLoading(false); // End loading state
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
          <button onClick={fetchAndInsert} style={{ padding: "10px", fontSize: "16px" }}>
      Fetch USDA Data
    </button>
        </div>)
    } 
      ;
    
    
    export default Login