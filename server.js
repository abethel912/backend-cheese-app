///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require('dotenv').config()
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, DATABASE_URL } = process.env
// import express
const express = require('express')
// create application object
const app = express()
// import mongoose
const mongoose = require('mongoose')
// import middlware
const cors = require('cors')
const morgan = require('morgan')

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
// Connection Events
mongoose.connection
  .on('open', () => console.log('Your are connected to mongoose'))
  .on('close', () => console.log('Your are disconnected from mongoose'))
  .on('error', (error) => console.log(error))

///////////////////////////////
// MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  img: String
})

const Cheeses = mongoose.model('Cheeses', CheeseSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()) // to prevent cors errors, open access to all origins
app.use(morgan('dev')) // logging
app.use(express.json()) // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get('/', (req, res) => {
  res.send('hello world')
})

// CHEESE INDEX ROUTE
app.get('/cheeses', async (req, res) => {
  try {
    // send all cheeses
    res.json(await Cheeses.find({}))
  } catch (error) {
    //send error
    res.status(400).json(error)
  }
})

// CHEESE CREATE ROUTE
app.post('/cheeses', async (req, res) => {
  try {
    // send all cheeses
    res.json(await Cheeses.create(req.body))
  } catch (error) {
    //send error
    res.status(400).json(error)
  }
})

// CHEESE Update ROUTE
app.put("/cheeses/:id", async (req, res) => {
  try {
    // send all cheese
    res.json(
      await Cheeses.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// CHEESE Delete ROUTE
app.delete("/cheeses/:id", async (req, res) => {
  try {
    // send all cheese
    res.json(await Cheeses.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
