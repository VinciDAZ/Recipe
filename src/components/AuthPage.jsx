import React from 'react';
import AuthPageInput from './AuthPageInput';
import { useNavigate } from "react-router-dom";

function AuthPage () {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState({
    username: "",
    password: "",
  })
  
  const handleSubmit = (event) => {  
    event.preventDefault();
    if (userInfo.username && userInfo.password) {
      navigate("/home");
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

  const handleRegister = () => {
    navigate("/register")
    
  }
  
  
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
          </div>
        </div>)
    } 
      ;
    
    
    export default AuthPage