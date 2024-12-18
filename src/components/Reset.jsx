import React from 'react';
import AuthPageInput from './AuthPageInput';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Reset () {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);

  

  const handleReset = async (event) => {  
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/reset", { email });
      setMessage(response.data.message);
      navigate("/login");
  } catch (err) {
      if (err.response) {
          // Server responded with a status other than 200 range
          setError(err.response.data.message);
      } else {
          setError("Something went wrong. Please try again later.");
      }
  }
};

  const handleChange = (event) => {
    const {value, name} = event.target;

    setEmail(prevValue => {
        return{
          ...prevValue,
            [name] : value
        };
      
    } )
  }

    return(
        <div>
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset}>
            <label htmlFor="password">New Password:</label>
            <AuthPageInput 
            onChange = {handleChange}
            value = {email}
            type = "email"
            />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <AuthPageInput 
            onChange = {handleChange}
            value = {email}
            type = "email"
            />
            <button type="submit">Reset Password</button>
        </form>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
    </div>)
}

export default Reset