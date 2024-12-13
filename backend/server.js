import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";


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
  

// Login Route
app.post("/register", async (req, res) => {
    const { fName, lName, username, password, email } = req.body;
    const full_name = `${fName} ${lName}`;
    const active = true; // Set a default value for "active" (you may want to change this based on your logic)
    const start_date = new Date(); // Set the current date as the "start_date"

  
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
  

// app.post("/register", async (req, res) => {
//     const { first_name, last_name, username, password, email_address } = req.body;
//     const full_name = `${first_name} ${last_name}`;
//     const active = true; // Default value for "active"
//     const start_date = new Date(); // Set the current date as the "start_date"
  
//     try {
//       // Hash the password before storing it in the database
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const values = [first_name, last_name, username, hashedPassword, email_address, active, start_date, full_name];
  
//       const query = `
//         INSERT INTO users (first_name, last_name, username, password, email_address, active, start_date, full_name)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       `;
      
//       await db.query(query, values);
//       res.json({ success: true, message: "User registered successfully." });
//     } catch (err) {
//       console.error("Error during registration:", err);
//       res.status(500).json({ success: false, message: "An error occurred during registration." });
//     }
//   });
  
  // Start Server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });