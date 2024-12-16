// Import required modules
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tourpackages = require('./Models/Tourmodel'); // Tour Packages model
const cors = require('cors');
const Customer = require('./Models/Customermodel'); // Customer model

// Initialize the app
const app = express();
dotenv.config(); // Load environment variables from .env file

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Port and MongoDB URI from environment variables
const PORT = process.env.PORT;
const uri = process.env.URI;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Mongoose connected successfully");
    } catch (err) {
        console.log(err.message);
        process.exit(1); // Exit the application if connection fails
    }
};
connectDB(); // Establish database connection

// Endpoint to create a new booking
app.post("/createbooking", async (req, res) => {
    const { name, email, phone, travelers, specialRequests, packageId, totalPrice } = req.body;
    try {
        const Customerdata = new Customer({
            Name: name,
            Email: email,
            Phone: phone,
            Travelers: travelers,
            Totalcost: totalPrice,
            SpecialRequest: specialRequests,
            PackageId: packageId
        });
        await Customerdata.save(); // Save booking details to the database
        res.status(201).json(Customerdata);
    } catch (error) {
        res.status(500).json({ message: "Failed to Book" });
    }
});

// Endpoint to delete a tour package by ID
app.delete("/deletepackage", async (req, res) => {
    const ID = req.body.packageId;
    try {
        const deletepackage = await Tourpackages.deleteOne({ _id: ID });
        res.status(202).json(deletepackage);
    } catch (err) {
        res.status(500).json({ message: "Failed to Delete Package" });
    }
});

// Endpoint to update a tour package
app.put("/updatepackage", async (req, res) => {
    try {
        const { _id, Title, Description, Price, Availabedate, Image } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Package ID is required" });
        }

        const updatedPackage = await Tourpackages.findByIdAndUpdate(
            _id,
            { Title, Description, Price, Availabedate, Image },
            { new: true, runValidators: true }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error("Error updating package:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Alternate endpoint to update a tour package using route parameter for ID
app.put("/updatepackage/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const { Title, Description, Price, Availabedate, Image } = req.body;
        const updatedPackage = await Tourpackages.findByIdAndUpdate(
            id,
            { Title, Description, Price, Availabedate, Image },
            { new: true, runValidators: true }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error("Error updating package:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Endpoint to fetch all tour packages
app.get("/getallpackages", async (req, res) => {
    try {
        const allPackages = await Tourpackages.find({});
        res.status(200).json(allPackages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tour packages" });
    }
});

// Endpoint to view all bookings
app.get("/viewbookings", async (req, res) => {
    try {
        const bookings = await Customer.find({});
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});

// Endpoint to fetch a single tour package by ID
app.get("/packages/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const package = await Tourpackages.findById({ _id: id });
        res.status(200).json(package);
    } catch (error) {
        res.status(500).json("Something went wrong");
    }
});

// Endpoint to delete a single tour package by ID
app.delete("/packages/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletepackage = await Tourpackages.deleteOne({ _id: id });
        res.status(202).json(deletepackage);
    } catch (error) {
        res.status(500).json("Something went wrong");
    }
});

// Endpoint to create a new tour package
app.post("/", async (req, res) => {
    const { title, description, price, image, availableDates } = req.body;
    try {
        const newtourpackage = new Tourpackages({
            Title: title,
            Description: description,
            Price: price,
            Availabedate: availableDates,
            Image: image
        });
        await newtourpackage.save(); // Save tour package to the database
        return res.status(201).json({
            message: 'Tour package created successfully',
            tourPackage: newtourpackage
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating tour package',
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
