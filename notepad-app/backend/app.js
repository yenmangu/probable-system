const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');

// express implementation
const app = express();

// Middleware declaration

// Middleware implementation
app.use(bodyParser.json());

//
module.exports = app;
