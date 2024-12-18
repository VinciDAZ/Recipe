import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cors from "cors";
import nodemailer from "nodemailer";


const app = express();
const port = 5000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool Configuration
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "food_website",
    password: "AlphaOmega1",
    port: 5432,
  });

  //Test connection to Database
  db.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Database connected successfully');
    }
  });

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    console.log(`Received username: ${username}, password: ${password}`);
    try {
        // Query the database to retrieve the user's hashed password
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
                // Check if the user exists
                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    console.log(`User found: ${JSON.stringify(user)}`);
                    
                    // Compare the provided password with the hashed password stored in the database
                    const isMatch = await bcrypt.compare(password, user.password);
                    console.log(`Password match: ${isMatch}`);
                    
                    // If passwords match, login successful
                    if (isMatch) {
                        res.json({ success: true, message: `Welcome ${user.full_name}.` });
                    } else {
                        // If passwords don't match, login failed
                        return res.status(401).send('Invalid username or password');
                    }
                
            } else {
                // If no user found with the provided username
                console.log('No user found with that username');
                return res.status(401).send('Invalid username or password');
            }
        } catch (err) {
            // If an error occurred during the login process
            console.error(`Error occurred: ${err.message}`);
            return res.status(500).send(`Error occurred: ${err.message}`);
        }
    });

// Register Route
app.post("/register", async (req, res) => {
    const { fName, lName, username, password, email } = req.body;
    const full_name = `${fName} ${lName}`;
    const active = true; 
    const start_date = new Date(); 

  
    try {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const values = [fName, lName, username, hashedPassword, email, active, start_date, full_name];
      // Insert user details into the database
      const query = `
      INSERT INTO users (first_name, last_name, username, password, email_address, active, start_date, full_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
      await db.query(query, values);
  
      res.json({ success: true, message: "User registered successfully." });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ success: false, message: "An error occurred during registration." });
    }
  });

  // Password Recovery Endpoint
  app.post("/recover", async (req, res) => {
    const { email } = req.body;
    
    try {
      // Check if the email exists in the database
      const result = await db.query("SELECT * FROM users WHERE email_address = $1", [email]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Email not found." });
      }
  
      // Generate a reset token and expiration (still needed for validation)
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
  
      // Store the reset token and expiration in the database
      await db.query("UPDATE users SET reset_token = $1, reset_expiration = $2 WHERE email_address = $3", [
        resetToken,
        resetExpiration,
        email,
      ]);
  
      // Return success message and the reset token (optional for frontend)
      res.json({
        success: true,
        message: "Password recovery process started. Please visit the reset page.",
        resetToken: resetToken, // Add token to the response (for frontend usage)
      });
      
    } catch (err) {
      console.error("Error during account recovery:", err);
      res.status(500).json({ success: false, message: "An error occurred during account recovery." });
    }
  });

app.post("/reset", async (req, res) => {
  const { token, password } = req.body;

  try {
    // Check if the token exists and is valid
    const result = await db.query("SELECT * FROM users WHERE reset_token = $1", [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    const user = result.rows[0];

    // Check if the token is expired
    const now = new Date();
    if (now > user.reset_expiration) {
      return res.status(400).json({ success: false, message: "Token has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token/expiration
    await db.query("UPDATE users SET password = $1, reset_token = NULL, reset_expiration = NULL WHERE reset_token = $2", [
      hashedPassword,
      token,
    ]);

    res.json({ success: true, message: "Password has been reset successfully." });

  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).json({ success: false, message: "An error occurred during password reset." });
  }
});
  
  // Start Server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });