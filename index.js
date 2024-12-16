const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Tourpackages = require('./Models/Tourmodel')
const cors= require('cors')
const Customer = require('./Models/Customermodel')
const app = express();
dotenv.config();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT
const uri = process.env.URI;

const connectDB = async()=>{
    try{
     await mongoose.connect(uri)
    console.log("mongoose connected successfully")
     }catch(err)
    {
     console.log(err.message);
     process.exit(1)
    }
}
connectDB();
app.post("/createbooking",async(req,res)=>{
    const {name,email,phone,travelers,specialRequests,packageId,totalPrice} = req.body
    try{
        const Customerdata = new Customer({
            Name:name,
            Email:email,
            Phone:phone,
            Travelers:travelers,
            Totalcost:totalPrice,
            SpecialRequest:specialRequests,
            PackageId:packageId
        })  
        await Customerdata.save();
        res.status(201).json(Customerdata);
    }catch(error)
    {
        res.status(500).json({ message: "Failed to Book" });
    }

    
})
app.delete("/deletepackage",async (req,res)=>{
    const ID = req.body.packageId
    try{
        const deletepackage = await Tourpackages.deleteOne({_id:ID})
        res.status(202).json(deletepackage)
    }
    catch(err){
        es.status(500).json({ message: "Failed to Book" });
    }

})
app.put("/updatepackage", async (req, res) => {
    try {
        const { 
            _id, 
            Title, 
            Description, 
            Price, 
            Availabedate, 
            Image 
        } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Package ID is required" });
        }

        const updatedPackage = await Tourpackages.findByIdAndUpdate(
            _id, 
            {
                Title,
                Description,
                Price,
                Availabedate,
                Image
            }, 
            { 
                new: true,  
                runValidators: true  
            }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json(updatedPackage);

    } catch (error) {
        console.error("Error updating package:", error);
        
        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation Error", 
                errors: error.errors 
            });
        }

        // Generic error response
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
});
app.put("/updatepackage/:id", async (req, res) => {
    const id = req.params.id
    try {
        const { 
            _id, 
            Title, 
            Description, 
            Price, 
            Availabedate, 
            Image 
        } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Package ID is required" });
        }

        const updatedPackage = await Tourpackages.findByIdAndUpdate(
            id, 
            {
                Title,
                Description,
                Price,
                Availabedate,
                Image
            }, 
            { 
                new: true,  
                runValidators: true  
            }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json(updatedPackage);

    } catch (error) {
        console.error("Error updating package:", error);
        
        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation Error", 
                errors: error.errors 
            });
        }

        // Generic error response
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
});
app.get("/getallpackages", async (req, res) => {
  try {
    
    const allPackages = await Tourpackages.find({});
    res.status(200).json(allPackages);
  } catch (error) {
    
   
    res.status(500).json({ message: "Failed to fetch tour packages" });
  }
});
app.get("/viewbookings",async(req,res)=>{
    const bookings =  await Customer.find({})
    res.status(200).json(bookings)
})
app.get("/packages/:id",async(req,res)=>{
    const id = req.params.id
    try{
        const pacakge = await Tourpackages.findById({_id:id})
        res.status(200).json(pacakge)
    }catch(error)
    {
        res.status(500).json("Something went wrong")
    }
})
app.delete("/packages/:id",async(req,res)=>{
    const id = req.params.id
    try{
        const deletepackage = await Tourpackages.deleteOne({_id:id})
        res.status(202).json(deletepackage)
    }catch(error)
    {
        res.status(500).json("Something went wrong")
    }
})

app.post("/",async(req,res)=>{
    const {title,description,price,image,availableDates} = req.body
    
    try{
        const newtourpackage = new Tourpackages({
            Title:title,
            Description:description,
            Price:price,
            Availabedate:availableDates,
            Image:image
        })
        await newtourpackage.save();
        return res.status(201).json({
            message: 'Tour package created successfully',
            tourPackage: newtourpackage 
        });

    }catch(error)
    {
        return res.status(500).json({
            message: 'Error creating tour package',
            error: error.message // Send error message
        });
    }
})
app.listen(PORT,()=>{
    console.log(`Application running on port ${PORT}`)
})
