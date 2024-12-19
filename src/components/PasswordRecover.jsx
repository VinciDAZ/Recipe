import React from "react";
import axios from "axios";
import AuthPageInput from "./AuthPageInput";
import { useNavigate } from "react-router-dom";

function PasswordRecovery() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState(null);
    const [error, setError] = React.useState(null);
  
    const handleReset = async (event) => {  
      event.preventDefault();
      setMessage(null);
      setError(null);
  
      try {
        const response = await axios.post("http://localhost:5000/recover", { email });
        setMessage(response.data.message);
  
        // After the response, redirect to the reset password page with the token
        if (response.data.success) {
          navigate(`/reset/${response.data.resetToken}`); // Pass token as URL parameter
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    };
  
    const handleChange = (event) => {
        const { value, name } = event.target;
      
        // Convert the email to lowercase before updating the state
        if (name === "email") {
          setEmail(value.toLowerCase());
        } else {
          setEmail(value);  // handle other fields as needed
        }
      }
  
    return (
      <div>
        <h2>Recover Your Password</h2>
        <form onSubmit={handleReset}>
          <label htmlFor="email">Email Address:</label>
          <AuthPageInput 
            onChange={handleChange}
            value={email}
            type="email"
            name="email"
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

export default PasswordRecovery;
