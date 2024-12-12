import React from 'react';
import AuthPageInput from './AuthPageInput';
import { useNavigate } from "react-router-dom";

function Register () {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState({
    fName: "",
    lName: "",
    username: "",
    password: "",
    email:"",
  })
  
  const handleSubmit = (event) => {  
    event.preventDefault();
    if (userInfo.username && userInfo.password) {
      alert(`Welcome, ${userInfo.username}!`);
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

  const handleSignUp = () => {
    navigate("/")
    
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

            <button onClick ={handleSignUp} type="register" className="register-button">
              Already have an account?
              </button>
          </form>
        </div>
      </div>)}
      ;
    
    
    export default Register