import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cors from "cors";
import axios from "axios";
import fs from "fs";

const apiToken = fs.readFileSync("../.token");

console.log(apiToken);

const app = express();
const port = 5000; 
const {Pool} = pkg
// Middleware
app.use(cors());
app.use(bodyParser.json());


// Create a connection pool
const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "food_website",
    password: "AlphaOmega1",
    port: 5432,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Wait up to 2 seconds for a connection
});

// Test the connection
db.connect()
    .then(client => {
        console.log('Database connected successfully');
        client.release(); // Release the client back to the pool
    })
    .catch(err => console.error('Error connecting to the database', err));



  app.get("/refreshUSDAData", async (req, res) => {
    const apiKey = apiToken;
    const baseURL = "https://api.nal.usda.gov/fdc/v1/foods/search";
  
    const excludedDescriptionKeywords = ["toddler", "fried", "salad"];
    const excludedFoodCategoriesKeywords = [
      "sandwiches", "cakes and pies", "pudding", "candy", "burgers",
      "formula", "dishes", "Stir-fry and soy-based sauce mixtures",
      "turnovers", "burritos and tacos", "fried rice", "lo/chow mein",
      "dips, gravies, other sauces", "pizza",
    ];
    const desiredNutrientIds = [1003, 1004, 1005, 1008, 2000, 1079];
  
    let allFoods = [];
    let currentPage = 1;
  
    try {
      // Loop through all pages to fetch all data
      while (true) {
        const response = await axios.get(baseURL, {
          params: {
            api_key: apiKey,
            pageSize: 45000,
            pageNumber: currentPage,
          },
        });
  
        const { foods, hasMoreResults } = response.data;
  
        const filteredFoods = foods.filter((food) => {
          const matchesExcludedDescription = food.description &&
            excludedDescriptionKeywords.some((keyword) =>
              food.description.toLowerCase().includes(keyword)
            );
  
          const matchesExcludedFoodCategory = food.foodCategory &&
            excludedFoodCategoriesKeywords.some((keyword) =>
              food.foodCategory.toLowerCase().includes(keyword)
            );
  
          return !matchesExcludedDescription &&
            !matchesExcludedFoodCategory &&
            food.foodNutrients.length > 0 &&
            food.finalFoodInputFoods &&
            food.finalFoodInputFoods.length > 0;
        });
  
        allFoods.push(...filteredFoods);
  
        // If no more results, break the loop
        if (!hasMoreResults) break;
        currentPage++;
      }
  
      // Now, all foods data should be in the allFoods array
  
      const client = await db.connect();
      try {
        await client.query("BEGIN");
  
        // Clear existing data and insert new data
        await client.query("TRUNCATE TABLE foods RESTART IDENTITY CASCADE");
        await client.query("TRUNCATE TABLE foodNutrients RESTART IDENTITY CASCADE");
        await client.query("TRUNCATE TABLE finalFoodInputFoods RESTART IDENTITY CASCADE");
        await client.query("TRUNCATE TABLE foodMeasures RESTART IDENTITY CASCADE");
  
        for (const food of allFoods) {
          await client.query(
            "INSERT INTO foods (fdcid, description, food_Category, common_names) VALUES ($1, $2, $3, $4)",
            [food.fdcId, food.description, food.foodCategory, food.commonNames]
          );
  
          for (const nutrient of food.foodNutrients.filter(n => desiredNutrientIds.includes(n.nutrientId))) {
            await client.query(
              "INSERT INTO foodNutrients (fdcid, nutrientId, nutrientname, unitname, unitvalue) VALUES ($1, $2, $3, $4, $5)",
              [food.fdcId, nutrient.foodNutrientId, nutrient.nutrientName, nutrient.unitName, nutrient.value]
            );
          }
  
          for (const inputFood of food.finalFoodInputFoods) {
            await client.query(
              "INSERT INTO finalFoodInputFoods (fdcId, gramweight, fooddescription) VALUES ($1, $2, $3)",
              [food.fdcId, inputFood.gramWeight, inputFood.foodDescription]
            );
          }
  
          if (food.foodMeasures) {
            for (const measure of food.foodMeasures) {
              await client.query(
                "INSERT INTO foodMeasures (fdcId, disseminationtext, gramweight) VALUES ($1, $2, $3)",
                [food.fdcId, measure.disseminationText, measure.gramWeight]
              );
            }
          }
        }
  
        await client.query("COMMIT");
        res.status(200).json({ success: true, message: "Data refreshed successfully" });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error during data insertion:", error.message);
        res.status(500).json({ success: false, message: "Data insertion failed" });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error fetching USDA data:", error.message);
      res.status(500).json({ error: "Failed to fetch USDA data." });
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

// Endpoint to fetch food names and descriptions
app.get("/db/foods", async (req, res) => {
  try {
    const result = await db.query("SELECT fdcid, description, food_category FROM foods");
    const foodNameList = result.rows; // Fetch rows from the database query
    res.json(foodNameList);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).send("An error occurred while fetching food data.");
  }
});

  // Start Server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });