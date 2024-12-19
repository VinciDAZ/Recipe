import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Reset() {
  const navigate = useNavigate();
  const { token } = useParams(); 
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/reset", {
        token, // Include the reset token from the URL
        password: formData.password,
      });

      // Handle success response from the server
      setMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000); // Redirect after a delay
    } catch (err) {
      // Handle error response
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Reset;
