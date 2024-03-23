import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import loadPDF from "./loader.js";
import { OpenAI } from "langchain/llms/openai"; // Importing OpenAI
import { loadQAStuffChain } from "langchain/chains";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import { Router } from "express";
import User from './User.js';
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import bcrypt from 'bcrypt';


dotenv.config();

const __filename = "F:/Project/SGP3/Backend/app.js"; // Remove 'file://'
const __dirname = "F:/Project/SGP3/Backend";

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static(path.join("F:/Project/SGP3/Frontend", "client/build")));
app.use(express.static(path.join(__dirname, "public")));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Connection URI
const uri = 'mongodb://localhost:27017'; // Update with your MongoDB URI

// Create a new MongoClient
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://localhost:27017/demodata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error: ', err));

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Look for the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No user found with this email' });
    }
    
    // Check if the password matches (insecurely)
    // WARNING: This is not secure and is for demonstration purposes only.
    if (user.password !== password) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }
    
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.post('/signup', async (req, res) => {
//   try {
//     // Extract user data from request body
//     const { name, email, password } = req.body;

//     // Create a new user document
//     const newUser = new User({ name, email, password });

//     // Save the new user to the database
//     await newUser.save();

//     // Respond with success message
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     // Handle error
//     console.error('Error creating user:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Close the MongoDB connection when the Node.js process is terminated
process.on('SIGINT', async () => {
  try {
      await client.close();
      console.log('MongoDB connection closed');
      process.exit(0);
  } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
  }
});


app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.get("/select", async (req, res) => {
  try {
    const resText = "hi";
    const pdfDirectory = process.env.PDF_DIRECTORY || "./pdfs"; // Directory containing PDF files
    const pdfFolders = fs
      .readdirSync(pdfDirectory)
      .filter((file) => file.endsWith(".pdf"));
    console.log(pdfFolders);
    res.render("response", { pdfFolders, resText });
    console.log(resText);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
console.log("hello");

app.get("/open", (req, res) => {
  try {
      // Get the selected PDF from the query parameter
      const selectedPdf = req.query.pdf;

      // Construct the path to the selected PDF file
      const pdfPath = path.join(__dirname, "pdfs", selectedPdf);

      // Check if the PDF file exists
      if (fs.existsSync(pdfPath)) {
          // If the PDF file exists, serve it as a static file
          res.sendFile(pdfPath);
      } else {
          // If the PDF file does not exist, respond with an error
          res.status(404).send("PDF not found");
      }
  } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.get("/ask", async (req, res) => {
  try {
    const pdfDirectory = process.env.PDF_DIRECTORY || "./pdfs"; // Directory containing PDF files
    const pdfFolders = fs
      .readdirSync(pdfDirectory)
      .filter((file) => file.endsWith(".pdf"));

    const selectedPdf = req.query.pdf;
    console.log(selectedPdf);
    const question = req.query.question || "";

    if (!selectedPdf) {
      return res.status(400).json({ error: "No PDF selected" });
    }

    loadPDF(selectedPdf, async (faissStorePath, { pdfName, vectorStore }) => {
      // Initialize OpenAI model
      const llmA = new OpenAI({ modelName: "gpt-3.5-turbo" });

      // Assuming loadQAStuffChain is a function to load QA chain
      const chainA = loadQAStuffChain(llmA);

      // Perform similarity search
      const result = await vectorStore.similaritySearch(question, 1);

      // Call QA chain with input documents and question
      const resA = await chainA.call({
        input_documents: result,
        question,
      });

      // Extract response text
      const resText = resA.text;
      console.log(resText);

      // Render response template with response text
      res.render("response", { pdfFolders, resText }); // Pass responseText here
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/auth", (req, res) => {
  res.sendFile(path.join("F:/Project/SGP3/Frontend", "client/build", "index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join("F:/Project/SGP3/Frontend", "client/build", "index.html"));
});
app.get("/select", (req, res) => {
  res.sendFile(path.join("F:/Project/SGP3/Frontend", "client/build", "index.html"));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
