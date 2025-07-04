import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config'; // For environment variables

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Schema with validation
const userdataschema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
  phone: { type: Number },
  mail: { type: String, match: /.+\@.+\..+/ }, // Simple email validation
  height: { type: Number },
  ispresent: { type: String, enum: ['present', 'absent'] }, // Only allow these values
});

const Studentbiodata = mongoose.model("Studentbiodata", userdataschema);

// Connect to MongoDB
mongoose.connect("mongodb+srv://Agalya:12345@cluster0.f2fptwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
      console.error("Server failed to start:", err.message);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit if DB connection fails
  });

// Routes
app.get("/sayhello", (req, res) => {
  console.log("request received");
  res.status(200).json({ name: "vijay", age: 15, spouse: "sangeetha" });
});

app.post("/actorinfo", async (req, res) => {
  try {
    console.log("data received:", req.body);
    const newData = new Studentbiodata(req.body);
    await newData.save();
    res.status(201).json({ datareceived: true }); // 201 for resource creation
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ 
      datareceived: false, 
      error: err.message,
      errors: err.errors // Mongoose validation errors if any
    });
  }
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
