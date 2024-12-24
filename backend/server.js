import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cors from "cors";
import axios from "axios";


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

  app.get("/fetchUSDAData", async (req, res) => { 
    const allData = [];
    const apiKey = "PB4cNBxOgbfVq1ujW6BHheZNHXWvgzlm2sS93UW6";
    const baseURL = "https://api.nal.usda.gov/fdc/v1/foods/search";
    const pageSize = 30000; // Number of items per page
    let currentPage = 1; // to 50 if page size is 1000
  
    const desiredNutrientIds = [1003, 1004, 1005, 1008, 2000, 1079]; // Nutrient numbers to filter

    try {
        while (true) {
            const response = await axios.get(baseURL, {
                params: {
                    api_key: apiKey,
                    pageSize,
                    pageNumber: currentPage,
                },
            });
    
            const { foods } = response.data;
            const filteredFoods = foods.map(food => {
                // Only include foods that have 'raw' in the description and have valid nutrients
                if (food.description && food.description.toLowerCase().includes("raw") &&
                    food.foodNutrients.length > 0 && food.finalFoodInputFoods && food.finalFoodInputFoods.length > 0) {
                    // Filter out the desired nutrients based on their nutrient number
                    const filteredNutrients = food.foodNutrients.filter(nutrient =>
                        desiredNutrientIds.includes(nutrient.nutrientId)
                    );
    
                    // Map finalFoodInputFoods to only include specific fields, if not empty array
                    const finalFoodInputFoods = food.finalFoodInputFoods && food.finalFoodInputFoods.length > 0
                        ? food.finalFoodInputFoods.map(item => ({
                            foodDescription: item.foodDescription,
                            gramWeight: item.gramWeight
                        }))
                        : null; // Only include if not empty array
    
                    const foodMeasures = food.foodMeasures && food.foodMeasures.length > 0
                        ? food.foodMeasures.map(item => ({
                            disseminationText: item.disseminationText,
                            gramWeight: item.gramWeight
                        }))
                        : null; // Only include if not empty array
    
                    // Return the necessary fields along with the filtered nutrients and specific foodMeasures/finalFoodInputFoods
                    return {
                        fdcId: food.fdcId,
                        description: food.description,
                        commonNames: food.commonNames,
                        servingSize: food.servingSize,
                        foodCategory: food.foodCategory,
                        foodNutrients: filteredNutrients.map(nutrient => ({
                            nutrientId: nutrient.nutrientId,
                            nutrientName: nutrient.nutrientName,
                            nutrientNumber: nutrient.nutrientNumber,
                            unitName: nutrient.unitName,
                            foodNutrientId: nutrient.foodNutrientId,
                            value: nutrient.value,
                        })),
                        // Include finalFoodInputFoods and foodMeasures only if they are not empty
                        ...(finalFoodInputFoods && { finalFoodInputFoods }), 
                        ...(foodMeasures && { foodMeasures }),
                    };
                }
    
                // If description does not include "raw" or any of the required fields are empty, return null
                return null; 
            }).filter(food => food !== null); // Remove null values from the array
            
            allData.push(...filteredFoods);
            
            if (!response.data.hasMoreResults) break;
            currentPage++;
    
        }
    
        // Send the filtered data to the front end as JSON
        res.json(allData);
    } catch (error) {
        console.error("Error fetching USDA data:", error.message);
        res.status(500).json({ error: "Failed to fetch USDA data." });
    }
    
  })

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