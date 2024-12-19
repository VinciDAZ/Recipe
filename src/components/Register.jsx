import React from 'react';
import AuthPageInput from './AuthPageInput';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register () {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState({
    fName: "",
    lName: "",
    username: "",
    password: "",
    email:"",
  })
  
  const handleSubmit = async (event) => {  
    event.preventDefault();

    if (userInfo.username && userInfo.password && userInfo.email && userInfo.fName && userInfo.lName) {
      try {
        // Post the user information to the server to register the user
        const response = await axios.post("http://localhost:5000/register", userInfo);
        
        // Handle the response from the server (e.g., success or error message)
        if (response.data.success) {
          console.log("User successfully registered.");
          navigate("/");  // Redirect to login page after successful registration
        } else {
          console.log("Registration failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
  
    // Convert the email to lowercase before updating the state
    if (name === "email") {
      setUserInfo(prevValue => ({
        ...prevValue,
        [name]: value.toLowerCase() // Convert email to lowercase
      }));
    } else {
      setUserInfo(prevValue => ({
        ...prevValue,
        [name]: value
      }));
    }
  };
  const handleHaveAccount = () => {
    navigate("/");
  
  }
       
      return (
      <div className="login-container">
        <div className="login-box">
          <h2>Create a new account</h2>
          <form onSubmit={handleSubmit}>

          <AuthPageInput 
                type="text"
                id="fName"
                name="fName"
                placeholder="first Name"
                value={userInfo.fName}
                onChange={handleChange}
                />
          <AuthPageInput 
                type="text"
                id="lName"
                name="lName"
                placeholder="last Name"
                value={userInfo.lName}
                onChange={handleChange}
                />
          
          <AuthPageInput  
               type="text"
               id="email"
               name="email"
               placeholder="email"
               value={userInfo.email}
               onChange={handleChange}
               />
         
          
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
                  placeholder="new password"
                  value={userInfo.password}
                  onChange={handleChange}
                />

            <button type="submit" className="login-button">
              Sign Up
            </button>

            <button onClick ={handleHaveAccount} type="register" className="register-button">
              Already have an account?
              </button>
          </form>
        </div>
      </div>)}
      ;
    
    
    export default Register